require('dotenv').config();
const express = require('express');
const cors = require('cors');
const debateRoutes = require('./routes/debate');
const historyRoutes = require('./routes/history');

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    /\.vercel\.app$/,
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/debate', debateRoutes);
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Council backend running on port ${PORT}`));
