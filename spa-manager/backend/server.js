require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const auth      = require('./src/middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta pública
app.use('/api/auth', require('./src/routes/auth'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Rutas protegidas (auth requerido, control de rol dentro de cada router)
app.use('/api/employees',    auth, require('./src/routes/employees'));
app.use('/api/clients',      auth, require('./src/routes/clients'));
app.use('/api/services',     auth, require('./src/routes/services'));
app.use('/api/appointments', auth, require('./src/routes/appointments'));
app.use('/api/schedule',     auth, require('./src/routes/schedule'));
app.use('/api/reports',      auth, require('./src/routes/reports'));
app.use('/api/expenses',     auth, require('./src/routes/expenses'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
