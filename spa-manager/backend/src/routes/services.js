const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM services ORDER BY name');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { name, base_price } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO services (name, base_price) VALUES ($1,$2) RETURNING *',
      [name, base_price]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  const { name, base_price } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE services SET name=$1,base_price=$2 WHERE id=$3 RETURNING *',
      [name, base_price, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM services WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
