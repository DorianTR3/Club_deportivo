const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

// Importar conexión DB
require('./src/config/database');

// Descomentamos la ruta de socios y el manejador de errores
const authRoutes    = require('./src/routes/auth.routes'); 
// const usuarioRoutes = require('./src/routes/usuario.routes'); 
const socioRoutes   = require('./src/routes/socio.routes');  // <-- ¡Despertando la ruta!
const errorHandler  = require('./src/middleware/errorHandler'); // <-- Para que los errores salgan limpios

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: '🚀 Servidor funcionando' });
});

app.use('/api/auth',     authRoutes); 
// app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/socios',   socioRoutes);     // <-- ¡Conectando el endpoint!
app.use(errorHandler);                     // <-- Activando el manejador

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El Servidor esta corriendo en http://localhost:${PORT}`);
});