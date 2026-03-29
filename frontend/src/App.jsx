import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Seats from './components/Seats';
import SpeechCard from './components/SpeechCard';
import ConsensusBlock from './components/ConsensusBlock';
import styles from './App.module.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const ROUND_LABELS = {
  1: 'Round I — Opening Statements',
  2: 'Round II — Cross-Examination',
  3: 'Round III — Convergence',
};

export default function App() {
  const [question, setQuestion] = useState('');
  const [running, setRunning] = useState(false);
  const [speakingModel, setSpeakingModel] = useState(null);
  const [modelStatuses, setModelStatuses] = useState({});
  const [speeches, setSpeeches] = useState([]);
  const [consensus, setConsensus] = useState(null);
  const [statusText, setStatusText] = useState('');
  const [debateId, setDebateId] = useState(null);
  const [error, setError] = useState('');
  const chamberRef = useRef(null);

  useEffect(() => {
    if (chamberRef.current) {
      chamberRef.current.scrollTop = chamberRef.current.scrollHeight;
    }
  }, [speeches, consensus]);

  function resetDebate() {
    setSpeeches([]);
    setConsensus(null);
    setDebateId(null);
    setSpeakingModel(null);
    setModelStatuses({});
    setStatusText('');
    setError('');
  }

  async function convene() {
    if (!question.trim()) { setError('Please pose a question to the council.'); return; }
    setError('');
    setRunning(true);
    resetDebate();

    const url = `${API_URL}/api/debate/stream?question=${encodeURIComponent(question)}`;
    const evtSource = new EventSource(url);

    evtSource.addEventListener('start', (e) => {
      const { debateId } = JSON.parse(e.data);
      setDebateId(debateId);
      setStatusText('The council convenes...');
      setModelStatuses({ claude: 'Summoned', gpt: 'Summoned', gemini: 'Summoned', llama: 'Summoned' });
    });

    evtSource.addEventListener('round_start', (e) => {
      const { round } = JSON.parse(e.data);
      setStatusText(`${ROUND_LABELS[round]}...`);
      setSpeeches(prev => [...prev, { type: 'round_header', round, label: ROUND_LABELS[round] }]);
    });

    evtSource.addEventListener('speaking', (e) => {
      const { modelKey, round } = JSON.parse(e.data);
      setSpeakingModel(modelKey);
      const statusMap = { 1: 'Deliberating...', 2: 'Rebutting...', 3: 'Converging...' };
      setModelStatuses(prev => ({ ...prev, [modelKey]: statusMap[round] }));
      setStatusText(`${modelKey} speaks — Round ${round}...`);
    });

    evtSource.addEventListener('speech', (e) => {
      const { modelKey, round, text } = JSON.parse(e.data);
      setSpeakingModel(null);
      setModelStatuses(prev => ({ ...prev, [modelKey]: round < 3 ? 'Listening...' : 'Complete' }));
      setSpeeches(prev => [...prev, { type: 'speech', modelKey, round, text }]);
    });

    evtSource.addEventListener('consensus_start', () => {
      setStatusText('The council forges its verdict...');
      setModelStatuses({ claude: 'Forging verdict...', gpt: 'Forging verdict...', gemini: 'Forging verdict...', llama: 'Forging verdict...' });
      setSpeakingModel('all');
    });

    evtSource.addEventListener('consensus', (e) => {
      const { text } = JSON.parse(e.data);
      setConsensus(text);
      setSpeakingModel(null);
    });

    evtSource.addEventListener('done', (e) => {
      const { debateId } = JSON.parse(e.data);
      setDebateId(debateId);
      setModelStatuses({ claude: 'Verdict reached', gpt: 'Verdict reached', gemini: 'Verdict reached', llama: 'Verdict reached' });
      setStatusText('');
      setRunning(false);
      evtSource.close();
    });

    evtSource.addEventListener('error', (e) => {
      try {
        const { message } = JSON.parse(e.data);
        setError(`Council error: ${message}`);
      } catch {
        setError('A connection error occurred. Please try again.');
      }
      setRunning(false);
      setSpeakingModel(null);
      setStatusText('');
      evtSource.close();
    });

    evtSource.onerror = () => {
      if (!running) return;
      setError('Lost connection to the council. Please try again.');
      setRunning(false);
      setSpeakingModel(null);
      setStatusText('');
      evtSource.close();
    };
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgTexture} />

      <div className={styles.app}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerOrnament}>⬥ &nbsp; The Chamber of Minds &nbsp; ⬥</div>
          <h1 className={styles.title}>THE COUNCIL</h1>
          <p className={styles.subtitle}>Four intelligences. One truth. Three rounds of debate.</p>
          <Link to="/history" className={styles.historyLink}>View past debates →</Link>
        </header>

        {/* Seats */}
        <Seats speakingModel={speakingModel} statuses={modelStatuses} />

        {/* Question */}
        <div className={styles.questionArea}>
          <label className={styles.questionLabel}>Pose your question to the Council</label>
          <textarea
            className={styles.questionInput}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="What question shall the council deliberate upon?"
            rows={3}
            disabled={running}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) convene(); }}
          />
          {error && <div className={styles.errorMsg}>{error}</div>}
          <button
            className={`${styles.conveneBtn} ${running ? styles.convening : ''}`}
            onClick={running ? undefined : convene}
            disabled={running}
          >
            {running ? '⌛ The Council is in session...' : '⬥  Convene the Council  ⬥'}
          </button>
        </div>

        {/* Chamber */}
        {speeches.length > 0 && (
          <div className={styles.chamber} ref={chamberRef}>
            {speeches.map((item, i) => {
              if (item.type === 'round_header') {
                return (
                  <div key={i} className={styles.roundHeader}>
                    <div className={styles.roundLine} />
                    <div className={styles.roundLabel}>{item.label}</div>
                    <div className={styles.roundLine} />
                  </div>
                );
              }
              return <SpeechCard key={i} modelKey={item.modelKey} round={item.round} text={item.text} />;
            })}

            {consensus && (
              <>
                <div className={styles.roundHeader}>
                  <div className={styles.roundLine} />
                  <div className={styles.roundLabel}>The Verdict</div>
                  <div className={styles.roundLine} />
                </div>
                <ConsensusBlock text={consensus} debateId={debateId} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      {statusText && (
        <div className={styles.statusBar}>
          <span className={styles.statusDot} />
          {statusText}
        </div>
      )}
    </div>
  );
}
