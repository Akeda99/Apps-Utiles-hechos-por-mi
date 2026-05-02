-- Migración v2: Servicios múltiples por atención + Gastos
-- Ejecutar conectado a spa_manager:
--   psql -U postgres -d spa_manager -f database/migrate_v2.sql

-- 1. Tabla de servicios por atención (varios por atención)
CREATE TABLE IF NOT EXISTS appointment_services (
  id             SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  service_id     INTEGER REFERENCES services(id) ON DELETE SET NULL,
  price          DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_apt_svc_appointment ON appointment_services(appointment_id);

-- 2. Migrar datos existentes (un servicio → junction table)
INSERT INTO appointment_services (appointment_id, service_id, price)
SELECT id, service_id, final_price
FROM appointments
WHERE service_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. Hacer service_id nullable en appointments (ya no se usará en nuevos registros)
ALTER TABLE appointments ALTER COLUMN service_id DROP NOT NULL;

-- 4. Tabla de gastos
CREATE TABLE IF NOT EXISTS expenses (
  id          SERIAL PRIMARY KEY,
  date        TIMESTAMP NOT NULL DEFAULT NOW(),
  amount      DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category    VARCHAR(50) DEFAULT 'general'
    CHECK (category IN ('general','insumos','servicios','alquiler','sueldos','otro')),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
