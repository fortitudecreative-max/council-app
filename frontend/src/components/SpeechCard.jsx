import React from 'react';
import styles from './SpeechCard.module.css';

const MODELS = {
  claude:  { name: 'Claude',  icon: '🜲' },
  gpt:     { name: 'ChatGPT', icon: '✦' },
  gemini:  { name: 'Gemini',  icon: '◈' },
  llama:   { name: 'Llama',   icon: '⟡' },
};

const ROUND_TAGS = { 1: 'Round I', 2: 'Round II', 3: 'Round III' };

export default function SpeechCard({ modelKey, round, text }) {
  const m = MODELS[modelKey];
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.icon}>{m.icon}</span>
        <span className={styles.name}>{m.name}</span>
        <span className={styles.tag}>{ROUND_TAGS[round]}</span>
      </div>
      <div className={styles.body}>
        {text.split('\n').map((line, i) => (
          <p key={i} className={styles.line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
