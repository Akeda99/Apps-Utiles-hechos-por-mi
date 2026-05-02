const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM clients ORDER BY name');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id/history', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT a.*, e.name AS employee_name, s.name AS service_name
      FROM appointments a
      JOIN employees e ON e.id = a.employee_id
      JOIN services  s ON s.id = a.service_id
      WHERE a.client_id = $1
      ORDER BY a.date DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { name, phone, notes } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO clients (name, phone, notes) VALUES ($1,$2,$3) RETURNING *',
      [name, phone || null, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  const { name, phone, notes } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE clients SET name=$1,phone=$2,notes=$3 WHERE id=$4 RETURNING *',
      [name, phone, notes, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM clients WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
