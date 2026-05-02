-- Datos de ejemplo para spa_manager

INSERT INTO employees (name, specialty, commission_percentage) VALUES
('María García',   'Colorista',   30),
('Carlos López',   'Barbero',     25),
('Ana Martínez',   'Masajista',   35),
('Luis Torres',    'Estilista',   28),
('Rosa Mendoza',   'Esteticista', 32);

INSERT INTO clients (name, phone, notes) VALUES
('Juan Pérez',    '999-111-222', 'Prefiere citas en la mañana'),
('Lucía Flores',  '999-333-444', 'Alérgica a ciertos tintes'),
('Roberto Castro','999-555-666', NULL),
('Carmen Silva',  '999-777-888', 'Cliente frecuente, descuento 10%'),
('Miguel Ríos',   '999-999-000', NULL);

INSERT INTO services (name, base_price) VALUES
('Corte de cabello',        25.00),
('Tinte completo',          80.00),
('Masaje relajante 60 min', 60.00),
('Facial hidratante',       50.00),
('Manicure',                20.00),
('Pedicure',                25.00),
('Corte + lavado',          35.00),
('Barbería completa',       30.00),
('Depilación cejas',        15.00),
('Limpieza facial',         40.00);

-- Atenciones de los últimos 30 días
INSERT INTO appointments (employee_id, client_id, service_id, final_price, payment_method, date) VALUES
(1, 1, 2,  80.00, 'cash', NOW() - INTERVAL '1 day'),
(2, 2, 1,  25.00, 'yape', NOW() - INTERVAL '1 day'),
(3, 3, 3,  60.00, 'card', NOW() - INTERVAL '2 days'),
(1, 4, 2,  90.00, 'cash', NOW() - INTERVAL '2 days'),
(4, 5, 7,  35.00, 'yape', NOW() - INTERVAL '3 days'),
(5, 1, 4,  50.00, 'cash', NOW() - INTERVAL '3 days'),
(2, 2, 8,  30.00, 'card', NOW() - INTERVAL '5 days'),
(1, 3, 2,  85.00, 'cash', NOW() - INTERVAL '5 days'),
(3, 4, 3,  65.00, 'yape', NOW() - INTERVAL '7 days'),
(4, 5, 1,  25.00, 'cash', NOW() - INTERVAL '7 days'),
(5, 1, 10, 40.00, 'card', NOW() - INTERVAL '10 days'),
(1, 2, 2,  80.00, 'cash', NOW() - INTERVAL '10 days'),
(2, 3, 8,  30.00, 'yape', NOW() - INTERVAL '12 days'),
(3, 4, 3,  60.00, 'cash', NOW() - INTERVAL '14 days'),
(4, 5, 7,  35.00, 'card', NOW() - INTERVAL '14 days'),
(1, 1, 4,  50.00, 'cash', NOW()),
(2, 2, 1,  25.00, 'yape', NOW()),
(3, 3, 3,  60.00, 'cash', NOW());
