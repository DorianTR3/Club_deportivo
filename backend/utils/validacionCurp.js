/**
 * Modulo de utilidad para validar el formato de la Clave Unica de Registro de Poblacion (CURP).
 * Verifica longitud y estructura alfanumerica estandar de 18 caracteres.
 */
function validarCURP(curp) {
    // Si el valor viene nulo o vacio, se rechaza inmediatamente
    if (!curp || curp.trim() === "") {
        return { 
            valido: false, 
            mensaje: "La CURP es un campo obligatorio." 
        };
    }

    const curpMayusculas = curp.toUpperCase().trim();

    // Verificacion de longitud exacta de 18 caracteres
    if (curpMayusculas.length !== 18) {
        return { 
            valido: false, 
            mensaje: "La CURP debe contener exactamente 18 caracteres." 
        };
    }

    // Expresion regular para validar el formato oficial mexicano
    // 4 letras, 6 numeros (fecha), 1 letra (sexo), 5 letras (estado y consonantes), 2 alfanumericos
    const regexCURP = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
    
    if (!regexCURP.test(curpMayusculas)) {
        return { 
            valido: false, 
            mensaje: "La estructura de la CURP es invalida. Verifique los caracteres." 
        };
    }

    // Si pasa todas las pruebas, retorna estado valido
    return { 
        valido: true, 
        mensaje: "Validacion exitosa." 
    };
}

// Exportacion del modulo para su uso en controladores
module.exports = { validarCURP };