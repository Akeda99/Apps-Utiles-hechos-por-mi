-- ============================================================
-- Sistema de Gestión de Spa / Peluquería
-- Crear primero la base de datos:
--   CREATE DATABASE spa_manager;
-- Luego ejecutar este script conectado a spa_manager
-- ============================================================

CREATE TABLE IF NOT EXISTS employees (
  id                   SERIAL PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  specialty            VARCHAR(100),
  commission_percentage DECIMAL(5,2) DEFAULT 0
    CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
  created_at           TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20),
  notes      TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id             SERIAL PRIMARY KEY,
  employee_id    INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  client_id      INTEGER REFERENCES clients(id)   ON DELETE SET NULL,
  service_id     INTEGER REFERENCES services(id)  ON DELETE SET NULL,
  final_price    DECIMAL(10,2) NOT NULL CHECK (final_price >= 0),
  payment_method VARCHAR(20) DEFAULT 'cash'
    CHECK (payment_method IN ('cash', 'yape', 'card')),
  date           TIMESTAMP DEFAULT NOW(),
  notes          TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule (
  id             SERIAL PRIMARY KEY,
  employee_id    INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  client_id      INTEGER REFERENCES clients(id)   ON DELETE SET NULL,
  service_id     INTEGER REFERENCES services(id)  ON DELETE SET NULL,
  scheduled_date TIMESTAMP NOT NULL,
  status         VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes          TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date     ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_employee ON appointments(employee_id);
CREATE INDEX IF NOT EXISTS idx_schedule_date         ON schedule(scheduled_date);
