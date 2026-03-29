const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// GET /api/history — list recent debates
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('debates')
    .select('id, question, consensus, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/history/:id — get full debate
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('debates')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Debate not found' });
  res.json(data);
});

module.exports = router;
