const express = require('express');
const router = express.Router();
const { callModel } = require('../lib/ai');
const { systemPromptFor, buildMessages, consensusSystemPrompt, MODEL_NAMES } = require('../lib/prompts');
const supabase = require('../lib/supabase');
const crypto = require('crypto');

const MODEL_ORDER = ['claude', 'gpt', 'gemini', 'llama'];

// SSE helper
function send(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

router.get('/stream', async (req, res) => {
  const { question } = req.query;
  if (!question) return res.status(400).json({ error: 'question is required' });

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const roundResponses = { 1: {}, 2: {}, 3: {} };
  const debateId = crypto.randomUUID();

  try {
    send(res, 'start', { debateId, question });

    for (let round = 1; round <= 3; round++) {
      send(res, 'round_start', { round });

      for (const modelKey of MODEL_ORDER) {
        send(res, 'speaking', { modelKey, round });

        const messages = buildMessages(modelKey, round, question, roundResponses);
        const system = systemPromptFor(modelKey, round);

        let text = '';
        try {
          text = await callModel(modelKey, messages, system);
        } catch (err) {
          text = `[${MODEL_NAMES[modelKey]} encountered an error: ${err.message}]`;
        }

        roundResponses[round][modelKey] = text;
        send(res, 'speech', { modelKey, round, text });
      }

      send(res, 'round_end', { round });
    }

    // Consensus
    send(res, 'consensus_start', {});

    const allRounds = [1, 2, 3]
      .map((r) =>
        Object.entries(roundResponses[r])
          .map(([k, v]) => `[Round ${r} — ${MODEL_NAMES[k]}]: ${v}`)
          .join('\n\n')
      )
      .join('\n\n===\n\n');

    const consensusMsgs = [{
      role: 'user',
      content: `Original question: "${question}"\n\nAll debate rounds:\n\n${allRounds}\n\nNow write the consensus verdict.`,
    }];

    let consensusText = '';
    try {
      const { callModel: cm } = require('../lib/ai');
      consensusText = await cm('claude', consensusMsgs, consensusSystemPrompt());
    } catch (err) {
      consensusText = `[Error generating consensus: ${err.message}]`;
    }

    send(res, 'consensus', { text: consensusText });

    // Save to Supabase
    try {
      await supabase.from('debates').insert({
        id: debateId,
        question,
        rounds: roundResponses,
        consensus: consensusText,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Supabase save error:', err.message);
    }

    send(res, 'done', { debateId });
  } catch (err) {
    send(res, 'error', { message: err.message });
  } finally {
    res.end();
  }
});

module.exports = router;
