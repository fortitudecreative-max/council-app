const MODEL_NAMES = {
  claude: 'Claude',
  gpt: 'ChatGPT',
  gemini: 'Gemini',
  llama: 'Llama',
};

function systemPromptFor(modelKey, round) {
  const name = MODEL_NAMES[modelKey];
  if (round === 1) {
    return `You are ${name}, a member of a council of four AI systems debating a question. This is Round 1. Provide your initial, honest, well-reasoned answer. Be direct and insightful. 2-4 paragraphs. Speak in first person as ${name}.`;
  }
  if (round === 2) {
    return `You are ${name}, a member of an AI council in Round 2 of debate. You have read the other council members' Round 1 responses. Now critically engage: point out where you agree, where you disagree, what was missed, and refine your position. Be intellectually honest and specific. 2-3 paragraphs.`;
  }
  if (round === 3) {
    return `You are ${name}, in the final round of council debate. You have heard 2 rounds of debate. Now work toward convergence: acknowledge where the council has aligned, state any remaining disagreements, and propose what you believe should be part of the final consensus answer. Be constructive and synthesis-oriented. 2-3 paragraphs.`;
  }
}

function buildMessages(modelKey, round, question, roundResponses) {
  const msgs = [{ role: 'user', content: question }];

  if (round >= 2) {
    const round1Summary = Object.entries(roundResponses[1])
      .map(([k, v]) => `${MODEL_NAMES[k]} said:\n${v}`)
      .join('\n\n---\n\n');
    msgs.push({ role: 'assistant', content: '(My Round 1 response was logged.)' });
    msgs.push({ role: 'user', content: `Round 1 responses from all council members:\n\n${round1Summary}\n\nNow give your Round 2 response.` });
  }

  if (round >= 3) {
    const round2Summary = Object.entries(roundResponses[2])
      .map(([k, v]) => `${MODEL_NAMES[k]} said:\n${v}`)
      .join('\n\n---\n\n');
    msgs.push({ role: 'assistant', content: '(My Round 2 response was logged.)' });
    msgs.push({ role: 'user', content: `Round 2 responses from all council members:\n\n${round2Summary}\n\nNow give your Round 3 (final convergence) response.` });
  }

  return msgs;
}

function consensusSystemPrompt() {
  return `You are a neutral arbiter synthesizing a council debate between Claude, ChatGPT, Gemini, and Meta Llama. Read all three rounds and write a definitive consensus answer that: (1) captures what all members agree on, (2) notes any unresolved nuances, (3) provides the clearest possible answer to the original question. Write 3-5 paragraphs. Authoritative, clear, and final. Do not reference yourself as Claude — you are the Council's collective voice.`;
}

module.exports = { systemPromptFor, buildMessages, consensusSystemPrompt, MODEL_NAMES };
