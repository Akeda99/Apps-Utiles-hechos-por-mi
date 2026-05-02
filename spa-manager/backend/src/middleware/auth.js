const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'spa_manager_secret_key_2024';

module.exports = function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado — inicia sesión' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Sesión expirada — inicia sesión de nuevo' });
  }
};
