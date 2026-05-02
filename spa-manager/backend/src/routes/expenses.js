const express   = require('express');
const router    = express.Router();
const db        = require('../db');
const adminOnly = require('../middleware/adminOnly');

router.get('/', adminOnly, async (req, res) => {
  const { date } = req.query;
  let condition = '';
  const params = [];
  if (date) {
    params.push(date);
    condition = `WHERE DATE(date) = $1`;
  }
  try {
    const { rows } = await db.query(
      `SELECT * FROM expenses ${condition} ORDER BY date DESC LIMIT 300`,
      params
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', adminOnly, async (req, res) => {
  const { amount, description, category, date } = req.body;
  if (!amount || !description) return res.status(400).json({ error: 'Monto y descripción requeridos' });
  try {
    const { rows } = await db.query(
      `INSERT INTO expenses (amount, description, category, date)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [parseFloat(amount), description, category || 'general', date || new Date()]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', adminOnly, async (req, res) => {
  const { amount, description, category, date } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE expenses SET amount=$1, description=$2, category=$3, date=$4 WHERE id=$5 RETURNING *`,
      [parseFloat(amount), description, category || 'general', date, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM expenses WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
