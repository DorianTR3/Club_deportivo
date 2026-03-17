// aqi jalo las librerias q ocupo pa encriptar y leer el arhcivo
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const {validarCURP} = require('../utils/validacionCurp');
// aqi armo la ruta donde tengo guardado mi json pa q no se pierda
const rutaJSON = path.join(__dirname, '../../data/socios.json');

// VALIDACIÓN COMPLETA DE SOCIO
function validarSocio(data) {
    const errores = [];

    if (!data.nombreCompleto || data.nombreCompleto.trim() === "") {
        errores.push("El nombre completo es obligatorio.");
    }

    const curpVal = validarCURP(data.curp);
    if (!curpVal.valido) {
        errores.push(curpVal.mensaje);
    }

    const tiposValidos = ["accionista", "rentista"];
    if (!tiposValidos.includes(data.tipoSocio)) {
        errores.push("Tipo de socio inválido.");
    }

    if (typeof data.modalidadFamiliar !== "boolean") {
        errores.push("La modalidad familiar debe ser true o false.");
    }

    if (!data.fechaNacimiento) {
        errores.push("La fecha de nacimiento es obligatoria.");
    }

    const resultadoCURP = validarCURP(datosFormulario.curp);
    if (!resultadoCURP.valido) {
        errores.push(resultadoCURP.mensaje);
    }

    const sexosValidos = ["Hombre", "Mujer", "No especificar"];
    if (!sexosValidos.includes(data.sexo)) {
        errores.push("Sexo inválido.");
    }

    if (!data.direccion || data.direccion.trim() === "") {
        errores.push("La dirección es obligatoria.");
    }

    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefonoRegex.test(data.telefono)) {
        errores.push("El teléfono debe tener 10 dígitos.");
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(data.correo)) {
        errores.push("Correo electrónico inválido.");
    }

    if (!data.fechaAlta) {
        errores.push("La fecha de alta es obligatoria.");
    }

    return {
        valido: errores.length === 0,
        errores
    };
}

module.exports = {
    validarCURP,
    validarSocio
};