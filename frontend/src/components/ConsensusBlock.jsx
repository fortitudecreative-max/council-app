import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ConsensusBlock.module.css';

export default function ConsensusBlock({ text, debateId }) {
  return (
    <div className={styles.block}>
      <div className={styles.head}>
        <span className={styles.ornament}>⚖</span>
        <span className={styles.title}>The Council's Verdict</span>
        {debateId && (
          <Link to={`/history/${debateId}`} className={styles.permalink}>
            permalink →
          </Link>
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
