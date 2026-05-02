const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', async (req, res) => {
  const { from, to } = req.query;
  const conditions = ['1=1'];
  const params = [];

  // Trabajadores solo ven su propia agenda
  if (req.user.role === 'worker' && req.user.employee_id) {
    params.push(req.user.employee_id);
    conditions.push(`sc.employee_id = $${params.length}`);
  }

  if (from) { params.push(from); conditions.push(`sc.scheduled_date >= $${params.length}`); }
  if (to)   { params.push(to);   conditions.push(`sc.scheduled_date <= $${params.length}`); }

  try {
    const { rows } = await db.query(`
      SELECT sc.*, e.name AS employee_name, c.name AS client_name,
             s.name AS service_name, s.base_price
      FROM schedule sc
      JOIN employees e ON e.id = sc.employee_id
      JOIN clients   c ON c.id = sc.client_id
      JOIN services  s ON s.id = sc.service_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY sc.scheduled_date ASC
    `, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  let { employee_id, client_id, service_id, scheduled_date, notes } = req.body;
  if (req.user.role === 'worker') employee_id = req.user.employee_id;
  try {
    const { rows } = await db.query(
      `INSERT INTO schedule (employee_id,client_id,service_id,scheduled_date,notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [employee_id, client_id, service_id, scheduled_date, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  const { status, employee_id, client_id, service_id, scheduled_date, notes } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE schedule
       SET status=$1,employee_id=$2,client_id=$3,service_id=$4,scheduled_date=$5,notes=$6
       WHERE id=$7 RETURNING *`,
      [status, employee_id, client_id, service_id, scheduled_date, notes, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM schedule WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
