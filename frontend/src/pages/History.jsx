import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './History.module.css';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function History() {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/history`)
      .then(r => r.json())
      .then(data => { setDebates(data); setLoading(false); })
      .catch(() => { setError('Failed to load debate history.'); setLoading(false); });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.app}>
        <header className={styles.header}>
          <Link to="/" className={styles.back}>← Back to the Chamber</Link>
          <div className={styles.ornament}>⬥ &nbsp; Archive of Deliberations &nbsp; ⬥</div>
          <h1 className={styles.title}>Past Debates</h1>
        </header>

        {loading && <p className={styles.loading}>Consulting the archives...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && debates.length === 0 && (
          <p className={styles.empty}>No debates have been recorded yet. <Link to="/">Convene the council.</Link></p>
        )}

        <div className={styles.list}>
          {debates.map(d => (
            <Link key={d.id} to={`/history/${d.id}`} className={styles.item}>
              <div className={styles.itemQuestion}>{d.question}</div>
              <div className={styles.itemMeta}>
                <span className={styles.itemDate}>
                  {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className={styles.itemArrow}>→</span>
              </div>
              {d.consensus && (
                <p className={styles.itemPreview}>
                  {d.consensus.slice(0, 160)}...
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
