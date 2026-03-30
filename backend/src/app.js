const express = require('express');
const app = express();

app.use(express.json());

// rutas
const authRoutes = require('./routes/auth.routes');
const sociosRoutes = require('./routes/socios.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

app.use('/api/auth', authRoutes);
app.use('/api/socios', sociosRoutes);
app.use('/api/usuarios-internos', usuariosRoutes);

// health
app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;