const express = require('express');
const router = express.Router();
const { crearUsuario } = require('../controllers/usuarios.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

router.post('/', verifyToken, checkRole(['admin']), crearUsuario);

module.exports = router;