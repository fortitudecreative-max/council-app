const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callClaude(messages, systemPrompt) {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  });
  return response.content[0].text;
}

async function callGPT(messages, systemPrompt) {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`GPT: ${data.error.message}`);
  return data.choices[0].message.content;
}

async function callGemini(messages, systemPrompt) {
  const fetch = (await import('node-fetch')).default;
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 8192 },
      }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(`Gemini: ${data.error.message}`);
  const parts = data.candidates[0].content.parts; const textParts = parts.filter(p => !p.thought); return (textParts.length > 0 ? textParts : parts).map(p => p.text).join('');
}

async function callLlama(messages, systemPrompt) {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      max_tokens: 1000,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Llama: ${typeof data.error === 'string' ? data.error : data.error.message}`);
  return data.choices[0].message.content;
}

async function callModel(modelKey, messages, systemPrompt) {
  switch (modelKey) {
    case 'claude': return callClaude(messages, systemPrompt);
    case 'gpt': return callGPT(messages, systemPrompt);
    case 'gemini': return callGemini(messages, systemPrompt);
    case 'llama': return callLlama(messages, systemPrompt);
    default: throw new Error(`Unknown model: ${modelKey}`);
  }
}

module.exports = { callModel };
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callClaude(messages, systemPrompt) {
    const response = await anthropic.messages.create({
          model: 'claude-opus-4-5',
          max_tokens: 1000,
          system: systemPrompt,
          messages,
    });
    return response.content[0].text;
}

async function callGPT(messages, systemPrompt) {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
                  model: 'gpt-4o',
                  max_tokens: 1000,
                  messages: [{ role: 'system', content: systemPrompt }, ...messages],
          }),
    });
    const data = await res.json();
    if (data.error) throw new Error(`GPT: ${data.error.message}`);
    return data.choices[0].message.content;h
}

async function callGemini(messages, systemPrompt) {
    const fetch = (await import('node-fetch')).default;
    const contents = messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
    }));
    const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        contents,
                        generationConfig: { maxOutputTokens: 8192 },
              }),
      }
        );
    const data = await res.json();
    if (data.error) throw new Error(`Gemini: ${data.error.message}`);
    const parts = data.candidates[0].content.parts; const textParts = parts.filter(p => !p.thought); return (textParts.length > 0 ? textParts : parts).map(p => p.text).join('');
}

async function callLlama(messages, systemPrompt) {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
          method: 'POST',
          headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          },
          body: JSON.stringify({h
                  model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
                  max_tokens: 1000,
                  messages: [{ role: 'system', content: systemPrompt }, ...messages],
          }),
    });
    const data = await res.json();
    if (data.error) throw new Error(`Llama: ${typeof data.error === 'string' ? data.error : data.error.message}`);
    return data.choices[0].message.content;
}

async function callModel(modelKey, messages, systemPrompt) {
    switch (modelKey) {
      case 'claude': return callClaude(messages, systemPrompt);
      case 'gpt': return callGPT(messages, systemPrompt);
      case 'gemini': return callGemini(messages, systemPrompt);
      case 'llama': return callLlama(messages, systemPrompt);
      default: throw new Error(`Unknown model: ${modelKey}`);
    }
}

module.exports = { callModel };
