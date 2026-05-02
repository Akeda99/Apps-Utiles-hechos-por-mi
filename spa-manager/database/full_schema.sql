-- ============================================================
-- Spa Manager — Schema completo para Supabase / PostgreSQL cloud
-- Pegar y ejecutar en el SQL Editor de Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS employees (
  id                    SERIAL PRIMARY KEY,
  name                  VARCHAR(100) NOT NULL,
  specialty             VARCHAR(100),
  commission_percentage DECIMAL(5,2) DEFAULT 0
    CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
  created_at            TIMESTAMP DEFAULT NOW()
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
  final_price    DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (final_price >= 0),
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

CREATE TABLE IF NOT EXISTS appointment_services (
  id             SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  service_id     INTEGER REFERENCES services(id) ON DELETE SET NULL,
  price          DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS expenses (
  id          SERIAL PRIMARY KEY,
  date        TIMESTAMP NOT NULL DEFAULT NOW(),
  amount      DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category    VARCHAR(50) DEFAULT 'general'
    CHECK (category IN ('general','insumos','servicios','alquiler','sueldos','otro')),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) DEFAULT 'worker'
    CHECK (role IN ('admin', 'worker')),
  employee_id   INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date       ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_employee   ON appointments(employee_id);
CREATE INDEX IF NOT EXISTS idx_schedule_date           ON schedule(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_apt_svc_appointment     ON appointment_services(appointment_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date           ON expenses(date);
