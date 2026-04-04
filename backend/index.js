const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

// Importar conexión DB
require('./src/config/database');

const authRoutes    = require('./src/routes/auth.routes'); 
const socioRoutes   = require('./src/routes/socio.routes');  
// 1. Importamos el archivo de rutas que creamos
const usuariosRoutes = require('./src/routes/usuarios.routes');
const rolesRoutes    = require('./src/routes/roles.routes'); // <-- Agregada esta línea
const errorHandler  = require('./src/middleware/errorHandler'); 

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: '🚀 Servidor funcionando' });
});

app.use('/api/auth',     authRoutes); 
app.use('/api/socios',   socioRoutes);     
// 2. Conectamos la ruta exacta que pide tu frontend
app.use('/api/usuarios-internos', usuariosRoutes); 
app.use('/api/roles',    rolesRoutes); // <-- Agregada para roles

app.use(errorHandler);                     

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El Servidor esta corriendo en http://localhost:${PORT}`);
});