const fs = require('fs');
const path = require('path');
const { validarSocio } = require('../utils/validaciones');

const rutaSocios = path.join(__dirname, '../data/socios.json');

const crearSocio = (req, res) => {
    const datos = req.body;

    const validacion = validarSocio(datos);

    if (!validacion.valido) {
        return res.status(400).json({
            mensaje: "Errores en los datos",
            errores: validacion.errores
        });
    }

    try {
        const data = fs.readFileSync(rutaSocios, 'utf-8');
        let socios = JSON.parse(data);

        socios.push(datos);

        fs.writeFileSync(rutaSocios, JSON.stringify(socios, null, 2));

        return res.status(201).json({
            mensaje: "Socio creado correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al guardar en la base de datos"
        });
    }
};

module.exports = {
    crearSocio
};