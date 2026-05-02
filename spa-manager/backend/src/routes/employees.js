const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM employees ORDER BY name');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { name, specialty, commission_percentage } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO employees (name, specialty, commission_percentage) VALUES ($1,$2,$3) RETURNING *',
      [name, specialty || null, commission_percentage || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, specialty, commission_percentage } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE employees SET name=$1,specialty=$2,commission_percentage=$3 WHERE id=$4 RETURNING *',
      [name, specialty, commission_percentage, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM employees WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
