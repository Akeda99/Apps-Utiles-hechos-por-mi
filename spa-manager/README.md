# Spa Manager — Sistema de gestión de spa/peluquería

## Stack
- **Backend**: Node.js + Express + PostgreSQL (pg)
- **Frontend**: React + Vite + Tailwind CSS + Recharts

---

## Requisitos previos
- Node.js 18+
- PostgreSQL 14+ corriendo localmente

---

## Configuración inicial

### 1. Base de datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE spa_manager;
\c spa_manager

# Ejecutar el esquema
\i database/schema.sql

# (Opcional) Cargar datos de ejemplo
\i database/seed.sql
```

### 2. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Correr en desarrollo
npm run dev

# O en producción
npm start
```

El servidor corre en **http://localhost:3001**

#### Variables de entorno (`.env`)
```
DATABASE_URL=postgresql://postgres:tu_contraseña@localhost:5432/spa_manager
PORT=3001
```

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Correr en desarrollo (proxy a :3001 incluido)
npm run dev
```

La app corre en **http://localhost:5173**

---

## Estructura del proyecto

```
spa-manager/
├── backend/
│   ├── server.js
│   ├── .env.example
│   └── src/
│       ├── db/index.js
│       └── routes/
│           ├── employees.js
│           ├── clients.js
│           ├── services.js
│           ├── appointments.js
│           ├── schedule.js
│           └── reports.js
├── frontend/
│   └── src/
│       ├── api/index.js
│       ├── components/
│       │   ├── Layout.jsx
│       │   └── Modal.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Employees.jsx
│           ├── Clients.jsx
│           ├── Services.jsx
│           ├── Appointments.jsx
│           ├── Schedule.jsx
│           └── Reports.jsx
└── database/
    ├── schema.sql
    └── seed.sql
```

---

## API REST

| Método | Endpoint                        | Descripción                     |
|--------|---------------------------------|---------------------------------|
| GET    | /api/employees                  | Listar empleados                |
| POST   | /api/employees                  | Crear empleado                  |
| PUT    | /api/employees/:id              | Editar empleado                 |
| DELETE | /api/employees/:id              | Eliminar empleado               |
| GET    | /api/clients                    | Listar clientes                 |
| GET    | /api/clients/:id/history        | Historial de un cliente         |
| POST   | /api/clients                    | Crear cliente                   |
| PUT    | /api/clients/:id                | Editar cliente                  |
| DELETE | /api/clients/:id                | Eliminar cliente                |
| GET    | /api/services                   | Listar servicios                |
| POST   | /api/services                   | Crear servicio                  |
| PUT    | /api/services/:id               | Editar servicio                 |
| DELETE | /api/services/:id               | Eliminar servicio               |
| GET    | /api/appointments?date=&employee_id= | Listar atenciones          |
| POST   | /api/appointments               | Registrar atención              |
| DELETE | /api/appointments/:id           | Eliminar atención               |
| GET    | /api/schedule?from=&to=         | Listar citas                    |
| POST   | /api/schedule                   | Crear cita                      |
| PUT    | /api/schedule/:id               | Actualizar estado de cita       |
| DELETE | /api/schedule/:id               | Eliminar cita                   |
| GET    | /api/reports/summary            | Resumen del día                 |
| GET    | /api/reports/employees?period=  | Ingresos por empleado           |
| GET    | /api/reports/daily-income       | Ingresos por día (30 días)      |
| GET    | /api/reports/top-services       | Servicios más vendidos          |
