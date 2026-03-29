import React from 'react';
import styles from './Seats.module.css';

const MODELS = {
  claude:  { name: 'Claude',  icon: '🜲' },
  gpt:     { name: 'ChatGPT', icon: '✦' },
  gemini:  { name: 'Gemini',  icon: '◈' },
  llama:   { name: 'Llama',   icon: '⟡' },
};

export default function Seats({ speakingModel, statuses }) {
  return (
    <div className={styles.seats}>
      {Object.entries(MODELS).map(([key, { name, icon }]) => {
        const isSpeaking = speakingModel === key || speakingModel === 'all';
        return (
          <div key={key} className={`${styles.seat} ${isSpeaking ? styles.speaking : ''}`}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.name}>{name}</span>
            <span className={styles.status}>
              {statuses[key] || 'Awaiting summons'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
