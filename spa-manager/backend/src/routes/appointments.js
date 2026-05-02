const express = require('express');
const router  = express.Router();
const db      = require('../db');

const SELECT_FULL = `
  SELECT
    a.id, a.employee_id, a.client_id, a.final_price, a.payment_method, a.date, a.notes,
    e.name  AS employee_name,
    c.name  AS client_name,
    COALESCE(STRING_AGG(s.name, ', ' ORDER BY svc.id), '') AS service_name,
    COALESCE(JSON_AGG(
      JSON_BUILD_OBJECT('id', svc.service_id, 'name', s.name, 'price', svc.price)
      ORDER BY svc.id
    ) FILTER (WHERE svc.id IS NOT NULL), '[]') AS services
  FROM appointments a
  LEFT JOIN employees e ON e.id = a.employee_id
  LEFT JOIN clients   c ON c.id = a.client_id
  LEFT JOIN appointment_services svc ON svc.appointment_id = a.id
  LEFT JOIN services s ON s.id = svc.service_id
`;

router.get('/', async (req, res) => {
  const { date, employee_id } = req.query;
  const conditions = ['1=1'];
  const params = [];

  if (req.user.role === 'worker' && req.user.employee_id) {
    params.push(req.user.employee_id);
    conditions.push(`a.employee_id = $${params.length}`);
  } else if (employee_id) {
    params.push(parseInt(employee_id));
    conditions.push(`a.employee_id = $${params.length}`);
  }

  if (date) {
    params.push(date);
    conditions.push(`DATE(a.date) = $${params.length}`);
  }

  try {
    const { rows } = await db.query(`
      ${SELECT_FULL}
      WHERE ${conditions.join(' AND ')}
      GROUP BY a.id, a.employee_id, a.client_id, a.final_price, a.payment_method, a.date, a.notes, e.name, c.name
      ORDER BY a.date DESC
      LIMIT 500
    `, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  let { employee_id, client_id, services, final_price, payment_method, date, notes } = req.body;

  if (req.user.role === 'worker') employee_id = req.user.employee_id;

  // services = [{id, price}]
  if (!Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ error: 'Se requiere al menos un servicio' });
  }

  // Auto-sum if final_price not provided
  const computed = services.reduce((sum, s) => sum + parseFloat(s.price || 0), 0);
  const price = (final_price !== '' && final_price != null) ? parseFloat(final_price) : computed;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO appointments (employee_id, client_id, final_price, payment_method, date, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [employee_id, client_id, price, payment_method || 'cash', date || new Date(), notes || null]
    );
    const apptId = rows[0].id;

    for (const svc of services) {
      await client.query(
        'INSERT INTO appointment_services (appointment_id, service_id, price) VALUES ($1,$2,$3)',
        [apptId, svc.id, parseFloat(svc.price || 0)]
      );
    }

    await client.query('COMMIT');

    const full = await db.query(`
      ${SELECT_FULL}
      WHERE a.id = $1
      GROUP BY a.id, a.employee_id, a.client_id, a.final_price, a.payment_method, a.date, a.notes, e.name, c.name
    `, [apptId]);

    res.status(201).json(full.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.put('/:id', async (req, res) => {
  let { employee_id, client_id, services, final_price, payment_method, date, notes } = req.body;

  if (req.user.role === 'worker') employee_id = req.user.employee_id;

  if (!Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ error: 'Se requiere al menos un servicio' });
  }

  const computed = services.reduce((sum, s) => sum + parseFloat(s.price || 0), 0);
  const price = (final_price !== '' && final_price != null) ? parseFloat(final_price) : computed;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE appointments SET employee_id=$1, client_id=$2, final_price=$3, payment_method=$4, date=$5, notes=$6 WHERE id=$7`,
      [employee_id, client_id, price, payment_method || 'cash', date, notes || null, req.params.id]
    );

    await client.query('DELETE FROM appointment_services WHERE appointment_id=$1', [req.params.id]);
    for (const svc of services) {
      await client.query(
        'INSERT INTO appointment_services (appointment_id, service_id, price) VALUES ($1,$2,$3)',
        [req.params.id, svc.id, parseFloat(svc.price || 0)]
      );
    }

    await client.query('COMMIT');

    const full = await db.query(`
      ${SELECT_FULL}
      WHERE a.id = $1
      GROUP BY a.id, a.employee_id, a.client_id, a.final_price, a.payment_method, a.date, a.notes, e.name, c.name
    `, [req.params.id]);

    res.json(full.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // appointment_services cascade on delete
    await db.query('DELETE FROM appointments WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
