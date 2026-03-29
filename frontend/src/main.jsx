import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import History from './pages/History';
import DebateDetail from './pages/DebateDetail';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<DebateDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
