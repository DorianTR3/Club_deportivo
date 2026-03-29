const express = require('express');
const router = express.Router();
const socioController = require('../controllers/socioController');

// Esta es la ruta POST que tu frontend (alta_socio.js) está buscando
router.post('/', socioController.crearSocio);

module.exports = router;