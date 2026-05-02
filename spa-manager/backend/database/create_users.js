// Ejecutar desde la carpeta backend: node database/create_users.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const USERS = [
  { username: 'admin',  password: 'admin123',  role: 'admin',  employee_name: null },
  { username: 'maria',  password: 'maria123',  role: 'worker', employee_name: 'María García' },
  { username: 'carlos', password: 'carlos123', role: 'worker', employee_name: 'Carlos López' },
  { username: 'ana',    password: 'ana123',    role: 'worker', employee_name: 'Ana Martínez' },
  { username: 'luis',   password: 'luis123',   role: 'worker', employee_name: 'Luis Torres' },
  { username: 'rosa',   password: 'rosa123',   role: 'worker', employee_name: 'Rosa Mendoza' },
];

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      username      VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(20) DEFAULT 'worker'
        CHECK (role IN ('admin', 'worker')),
      employee_id   INTEGER REFERENCES employees(id) ON DELETE SET NULL,
      created_at    TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✓ Tabla users lista\n');

  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);

    let employee_id = null;
    if (u.employee_name) {
      const { rows } = await pool.query(
        'SELECT id FROM employees WHERE name = $1', [u.employee_name]
      );
      employee_id = rows[0]?.id ?? null;
      if (!employee_id) console.warn(`  ⚠ Empleado "${u.employee_name}" no encontrado — usuario sin vincular`);
    }

    await pool.query(
      `INSERT INTO users (username, password_hash, role, employee_id)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (username) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             role          = EXCLUDED.role,
             employee_id   = EXCLUDED.employee_id`,
      [u.username, hash, u.role, employee_id]
    );
    console.log(`  ✓ ${u.username} / ${u.password}  (${u.role}${employee_id ? ' → ' + u.employee_name : ''})`);
  }

  console.log('\n✅ Usuarios creados. Credenciales:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  USERS.forEach(u => console.log(`  ${u.role === 'admin' ? '👑' : '👤'} ${u.username.padEnd(8)} / ${u.password}`));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await pool.end();
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
