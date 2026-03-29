import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SpeechCard from '../components/SpeechCard';
import ConsensusBlock from '../components/ConsensusBlock';
import styles from './DebateDetail.module.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const ROUND_LABELS = {
  1: 'Round I — Opening Statements',
  2: 'Round II — Cross-Examination',
  3: 'Round III — Convergence',
};

const MODEL_ORDER = ['claude', 'gpt', 'gemini', 'llama'];

export default function DebateDetail() {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/history/${id}`)
      .then(r => r.json())
      .then(data => { setDebate(data); setLoading(false); })
      .catch(() => { setError('Debate not found.'); setLoading(false); });
  }, [id]);

  if (loading) return <div className={styles.center}>Retrieving debate from archives...</div>;
  if (error) return <div className={styles.center}>{error} <Link to="/history">← Back</Link></div>;

  return (
    <div className={styles.page}>
      <div className={styles.app}>
        <header className={styles.header}>
          <Link to="/history" className={styles.back}>← Archive</Link>
          <div className={styles.ornament}>⬥ &nbsp; Debate Record &nbsp; ⬥</div>
          <h1 className={styles.question}>{debate.question}</h1>
          <p className={styles.date}>
            {new Date(debate.created_at).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            })}
          </p>
        </header>

        {[1, 2, 3].map(round => (
          <div key={round}>
            <div className={styles.roundHeader}>
              <div className={styles.roundLine} />
              <div className={styles.roundLabel}>{ROUND_LABELS[round]}</div>
              <div className={styles.roundLine} />
            </div>
            {MODEL_ORDER.map(modelKey => {
              const text = debate.rounds?.[round]?.[modelKey];
              if (!text) return null;
              return <SpeechCard key={modelKey} modelKey={modelKey} round={round} text={text} />;
            })}
          </div>
        ))}

        {debate.consensus && (
          <>
            <div className={styles.roundHeader}>
              <div className={styles.roundLine} />
              <div className={styles.roundLabel}>The Verdict</div>
              <div className={styles.roundLine} />
            </div>
            <ConsensusBlock text={debate.consensus} />
          </>
        )}
      </div>
    </div>
  );
}
