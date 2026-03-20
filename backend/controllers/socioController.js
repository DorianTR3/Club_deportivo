const fs = require('fs');
const path = require('path');
// Importacion relativa ajustada: el archivo esta en la misma carpeta controllers
const { validarSocio } = require('./validacionSocios'); 

const rutaSocios = path.join(__dirname, '../data/socios.json');

const crearSocio = (req, res) => {
    // Mapeo de los nombres de los inputs del HTML a las variables del validador
    const datosMapeados = {
        nombreCompleto: `${req.body.nombre || ''} ${req.body.apellido || ''}`.trim(),
        curp: req.body.curp,
        tipoSocio: req.body.tipo_socio,
        modalidadFamiliar: req.body.modalidad === 'familiar', 
        fechaNacimiento: req.body.fecha_nacimiento,
        sexo: req.body.genero,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        correo: req.body.email_contacto,
        fechaAlta: new Date().toISOString().split('T')[0] 
    };

    const validacion = validarSocio(datosMapeados);

    if (!validacion.valido) {
        return res.status(400).json({
            exito: false,
            mensajes: validacion.errores
        });
    }

    try {
        const data = fs.readFileSync(rutaSocios, 'utf-8');
        let socios = JSON.parse(data);

        // Generacion secuencial del identificador de socio
        const totalSocios = socios.length + 1;
        const numeroGenerado = "SOC-" + totalSocios.toString().padStart(4, '0');

        datosMapeados.numero_socio = numeroGenerado;
        datosMapeados.estado = "Activo";

        socios.push(datosMapeados);

        fs.writeFileSync(rutaSocios, JSON.stringify(socios, null, 2));

        return res.status(201).json({
            exito: true,
            mensaje: "Registro guardado en JSON",
            numero_socio: numeroGenerado
        });
    } catch (error) {
        console.error("Error de escritura de archivo:", error);
        return res.status(500).json({
            exito: false,
            mensajes: ["Fallo interno del servidor de archivos"]
        });
    }
};

module.exports = { crearSocio };