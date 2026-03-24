// Importación exclusiva de la utilidad necesaria para este módulo
const { validarCURP } = require('../utils/validacionCurp');
/**
 * Valida la integridad de los datos recibidos para un nuevo socio.
 * Retorna un objeto con el estado de la validación y un arreglo de errores si los hay.
 */
function validarSocio(data) {
    const errores = [];

    // Validación de presencia de datos básicos
    if (!data.nombreCompleto || data.nombreCompleto.trim() === "") {
        errores.push("El nombre completo es obligatorio.");
    }

    // Validación estructural de la CURP mediante la utilidad externa
    const curpVal = validarCURP(data.curp);
    if (!curpVal.valido) {
        errores.push(curpVal.mensaje);
    }

    // Verificación contra los tipos de membresía permitidos en el sistema
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

    const sexosValidos = ["Hombre", "Mujer", "Otro", "No especificar"];
    if (!sexosValidos.includes(data.sexo)) {
        errores.push("Sexo inválido.");
    }

    if (!data.direccion || data.direccion.trim() === "") {
        errores.push("La dirección es obligatoria.");
    }

    // Validación de formato telefónico (exactamente 10 dígitos numéricos)
    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefonoRegex.test(data.telefono)) {
        errores.push("El teléfono debe tener 10 dígitos numéricos.");
    }

    // Validación de formato estándar para correo electrónico
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(data.correo)) {
        errores.push("El formato del correo electrónico es inválido.");
    }

    return {
        valido: errores.length === 0,
        errores
    };
}

module.exports = { validarSocio };