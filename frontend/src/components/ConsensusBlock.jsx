import React, { useState } from 'react';
import styles from './ConsensusBlock.module.css';

export default function ConsensusBlock({ text, debateId }) {
  const [copied, setCopied] = useState(false);

  function shareDebate() {
    const url = `${window.location.origin}/history/${debateId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className={styles.block}>
      <div className={styles.head}>
        <span className={styles.ornament}>⚖</span>
        <span className={styles.title}>The Council's Verdict</span>
        {debateId && (
          <button onClick={shareDebate} className={styles.shareBtn}>
            {copied ? '✓ Link copied!' : '⬥ Share this debate'}
          </button>
        )}
      </div>
      <div className={styles.body}>
        {text.split('\n').map((line, i) => (
          <p key={i} className={styles.line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
