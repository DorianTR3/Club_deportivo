// aqi jalo las librerias q ocupo pa encriptar y leer el arhcivo
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// aqi armo la ruta donde tengo guardado mi json pa q no se pierda
const rutaJSON = path.join(__dirname, '../../data/UsuariosInternos.json');

const procesarNuevoEmpleado = (req, res) => {
    const datosFormulario = req.body;
    let errores = [];

    // reviso q mandaran todos los datos obligatorios pa q no trone
    const camposRequeridos = [
        'nombreCompleto', 'curp', 'rolDentroDeLaEmpresa', 'fechaNacimiento', 
        'sexo', 'direccion', 'telefono', 'correo', 'fechaAlta', 'contrasena'
    ];
    
    camposRequeridos.forEach(campo => {
        if (!datosFormulario[campo] || datosFormulario[campo].trim() === "") {
            errores.push(`falta llenar el canpo: ${campo}`);
        }
    });

    if (errores.length > 0) return res.status(400).json({ exito: false, mensajes: errores });

    // valido q el curp se vea vien y tenga 18 caracteres justos
    if (datosFormulario.curp.length !== 18) {
        errores.push("el curp deve tener 18 caracteres exactos");
    }

    // defino los roles q si existen en el club
    const rolesValidos = ['instructor', 'Recepcionista', 'coordinador', 'administrador', 'otro'];
    if (!rolesValidos.includes(datosFormulario.rolDentroDeLaEmpresa)) {
        errores.push("ese rol no exsiste en la empresa");
    }

    // verifico q el correo si paresca un correo de verdad
    const patronCorreo = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if (!patronCorreo.test(datosFormulario.correo)) {
        errores.push("el coreo esta mal escrito o no tiene formato");
    }

    // checo q el telefono sean puros numeros y tenga 10 dijitos
    const esSoloNumeros = /^\d+$/.test(datosFormulario.telefono);
    if (!esSoloNumeros || datosFormulario.telefono.length !== 10) {
        errores.push("el telefono deven ser 10 numeros sin espacios");
    }

    if (errores.length > 0) return res.status(400).json({ exito: false, mensajes: errores });

    // si todo salio vien preparo el objeto pa guardarlo
    let nuevoUsuario = { ...datosFormulario };
    
    // aqi le meto el estado activo por defolt pa mi control interno
    nuevoUsuario.estado = 'Activo';

    // encripto la contrasena pa no tener broncas de segurida
    const salt = bcrypt.genSaltSync(10);
    nuevoUsuario.contrasena = bcrypt.hashSync(datosFormulario.contrasena, salt);

    // aqi leo el json agrego al wey nuevo y lo buelvo a guardar
    try {
        const data = fs.readFileSync(rutaJSON, 'utf8');
        let usuarios = JSON.parse(data);
        
        usuarios.push(nuevoUsuario);
        
        fs.writeFileSync(rutaJSON, JSON.stringify(usuarios, null, 2));
        
        return res.status(201).json({ exito: true, mensaje: "Usuario registrado con exito" });
    } catch (error) {
        return res.status(500).json({ exito: false, mensaje: "error al guardar en la base de datos" });
    }
};

module.exports = { procesarNuevoEmpleado };