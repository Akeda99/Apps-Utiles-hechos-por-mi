const express   = require('express');
const router    = express.Router();
const db        = require('../db');
const adminOnly = require('../middleware/adminOnly');

// Construye la condición de fecha a partir de period o from/to
function buildDateFilter(period, from, to, alias = 'a') {
  if (from && to)         return `AND ${alias}.date >= '${from}' AND ${alias}.date < ('${to}'::date + INTERVAL '1 day')`;
  if (period === 'day')   return `AND DATE(${alias}.date) = CURRENT_DATE`;
  if (period === 'week')  return `AND ${alias}.date >= CURRENT_DATE - INTERVAL '7 days'`;
  if (period === 'month') return `AND ${alias}.date >= DATE_TRUNC('month', CURRENT_DATE)`;
  return ''; // 'all'
}

// Ingresos por empleado
router.get('/employees', adminOnly, async (req, res) => {
  const { period, from, to } = req.query;
  const dateFilter = buildDateFilter(period, from, to);
  try {
    const { rows } = await db.query(`
      SELECT
        e.id, e.name, e.specialty, e.commission_percentage,
        COUNT(a.id)                                                    AS appointments_count,
        COALESCE(SUM(a.final_price), 0)                                AS total_revenue,
        COALESCE(SUM(a.final_price * e.commission_percentage / 100), 0) AS commission_earned
      FROM employees e
      LEFT JOIN appointments a ON a.employee_id = e.id ${dateFilter}
      GROUP BY e.id, e.name, e.specialty, e.commission_percentage
      ORDER BY total_revenue DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Ingresos diarios para gráfico (acepta from/to o últimos N días)
router.get('/daily-income', adminOnly, async (req, res) => {
  const { from, to } = req.query;
  let condition;
  if (from && to) {
    condition = `WHERE date >= '${from}' AND date < ('${to}'::date + INTERVAL '1 day')`;
  } else {
    condition = "WHERE date >= CURRENT_DATE - INTERVAL '30 days'";
  }
  try {
    const { rows } = await db.query(`
      SELECT DATE(date) AS day, SUM(final_price) AS total
      FROM appointments
      ${condition}
      GROUP BY DATE(date)
      ORDER BY day
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Servicios más vendidos
router.get('/top-services', adminOnly, async (_req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT s.name, COUNT(svc.id) AS count, COALESCE(SUM(svc.price), 0) AS total
      FROM services s
      LEFT JOIN appointment_services svc ON svc.service_id = s.id
      GROUP BY s.id, s.name
      ORDER BY count DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Resumen con soporte de period y from/to
router.get('/summary', adminOnly, async (req, res) => {
  const { period, from, to } = req.query;
  const dateFilter = buildDateFilter(period, from, to);

  // Si hay rango custom, devuelve solo ese rango; si no, devuelve hoy/semana/mes fijos
  try {
    if (from && to) {
      const [rangeResult, appts] = await Promise.all([
        db.query(`SELECT COALESCE(SUM(final_price),0) AS total, COUNT(*) AS count FROM appointments WHERE 1=1 ${dateFilter}`),
        db.query(`SELECT COALESCE(SUM(final_price),0) AS total FROM appointments WHERE date >= CURRENT_DATE - INTERVAL '7 days'`),
      ]);
      return res.json({
        custom:             rangeResult.rows[0].total,
        custom_count:       rangeResult.rows[0].count,
        today:              null,
        week:               appts.rows[0].total,
        month:              null,
        appointments_today: null,
      });
    }

    const [today, week, month, appts] = await Promise.all([
      db.query("SELECT COALESCE(SUM(final_price),0) AS total FROM appointments WHERE DATE(date) = CURRENT_DATE"),
      db.query("SELECT COALESCE(SUM(final_price),0) AS total FROM appointments WHERE date >= CURRENT_DATE - INTERVAL '7 days'"),
      db.query("SELECT COALESCE(SUM(final_price),0) AS total FROM appointments WHERE date >= DATE_TRUNC('month', CURRENT_DATE)"),
      db.query("SELECT COUNT(*) AS count FROM appointments WHERE DATE(date) = CURRENT_DATE"),
    ]);
    res.json({
      today:              today.rows[0].total,
      week:               week.rows[0].total,
      month:              month.rows[0].total,
      appointments_today: appts.rows[0].count,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Resumen personal de un empleado (para vista trabajador)
router.get('/my-summary', async (req, res) => {
  // Este endpoint lo llaman trabajadores — no está bloqueado por adminOnly
  const employee_id = req.user.employee_id;
  if (!employee_id) return res.json({ today: 0, week: 0, appointments_today: 0, commission_today: 0 });

  try {
    const emp = await db.query('SELECT commission_percentage FROM employees WHERE id=$1', [employee_id]);
    const pct = parseFloat(emp.rows[0]?.commission_percentage || 0);

    const [today, week, appts] = await Promise.all([
      db.query("SELECT COALESCE(SUM(final_price),0) AS total FROM appointments WHERE employee_id=$1 AND DATE(date) = CURRENT_DATE", [employee_id]),
      db.query("SELECT COALESCE(SUM(final_price),0) AS total FROM appointments WHERE employee_id=$1 AND date >= CURRENT_DATE - INTERVAL '7 days'", [employee_id]),
      db.query("SELECT COUNT(*) AS count FROM appointments WHERE employee_id=$1 AND DATE(date) = CURRENT_DATE", [employee_id]),
    ]);

    const todayTotal = parseFloat(today.rows[0].total);
    res.json({
      today:              todayTotal,
      week:               parseFloat(week.rows[0].total),
      appointments_today: appts.rows[0].count,
      commission_today:   todayTotal * pct / 100,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Cierre del día
router.get('/day-closing', adminOnly, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  try {
    const [appts, exps] = await Promise.all([
      db.query(`
        SELECT a.id, a.final_price, a.payment_method, a.date,
          c.name AS client_name,
          e.name AS employee_name,
          COALESCE(STRING_AGG(s.name, ', ' ORDER BY svc.id), '') AS service_name
        FROM appointments a
        LEFT JOIN clients c ON c.id = a.client_id
        LEFT JOIN employees e ON e.id = a.employee_id
        LEFT JOIN appointment_services svc ON svc.appointment_id = a.id
        LEFT JOIN services s ON s.id = svc.service_id
        WHERE DATE(a.date) = $1
        GROUP BY a.id, a.final_price, a.payment_method, a.date, c.name, e.name
        ORDER BY a.date
      `, [date]),
      db.query(`
        SELECT id, date, amount, description, category
        FROM expenses WHERE DATE(date) = $1 ORDER BY date
      `, [date]),
    ]);

    const income = { cash: 0, yape: 0, card: 0, total: 0 };
    for (const a of appts.rows) {
      const v = parseFloat(a.final_price);
      income[a.payment_method] = (income[a.payment_method] || 0) + v;
      income.total += v;
    }
    const expensesTotal = exps.rows.reduce((s, e) => s + parseFloat(e.amount), 0);

    res.json({
      date,
      appointments: appts.rows,
      expenses:     exps.rows,
      income,
      expenses_total: expensesTotal,
      net_cash: income.cash - expensesTotal,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
