const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

// Importar conexión DB
require('./src/config/database');

// const authRoutes    = require('./src/routes/auth.routes');    // ← comentado
// const usuarioRoutes = require('./src/routes/usuario.routes'); // ← comentado
// const socioRoutes   = require('./src/routes/socio.routes');   // ← comentado
// const errorHandler  = require('./src/middleware/errorHandler'); // ← comentado

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: '🚀 Servidor funcionando' });
});

// app.use('/api/auth',     authRoutes);      // ← comentado
// app.use('/api/usuarios', usuarioRoutes);   // ← comentado
// app.use('/api/socios',   socioRoutes);     // ← comentado
// app.use(errorHandler);                     // ← comentado

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El Servidor esta corriendo en http://localhost:${PORT}`);
});