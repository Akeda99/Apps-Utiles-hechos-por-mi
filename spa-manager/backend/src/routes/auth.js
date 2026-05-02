const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'spa_manager_secret_key_2024';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }
  try {
    const { rows } = await db.query(
      `SELECT u.*, e.name AS employee_name
       FROM users u
       LEFT JOIN employees e ON e.id = u.employee_id
       WHERE u.username = $1`,
      [username]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const payload = {
      id:          user.id,
      username:    user.username,
      role:        user.role,
      employee_id: user.employee_id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

    res.json({
      token,
      user: {
        ...payload,
        employee_name: user.employee_name,
      },
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
