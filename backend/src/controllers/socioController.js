const pool = require('../config/database');
const { validarSocio } = require('./validacionSocios');
const { validarCURP } = require('../utils/validacionCurp');

const crearSocio = async (req, res) => {
    // Recibimos los campos separados directamente del frontend
    const datos = {
        nombre: req.body.nombre,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno || null,
        curp: req.body.curp,
        tipo: req.body.tipo,
        modalidad: req.body.modalidad,
        fecha_nacimiento: req.body.fecha_nacimiento,
        genero: req.body.genero,
        email: req.body.email,
        telefono: req.body.telefono
    };

    // Validaciones
    const validacion = validarSocio(datos);
    if (!validacion.valido) return res.status(400).json({ errores: validacion.errores });
    if (!validarCURP(datos.curp)) return res.status(400).json({ error: "CURP inválida" });
    if (!datos.fecha_nacimiento) return res.status(400).json({ error: "Fecha de nacimiento es requerida" });

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Validar CURP única
        const existe = await client.query(
            "SELECT * FROM socios WHERE curp = $1",
            [datos.curp]
        );

        if (existe.rows.length > 0) {
            return res.status(409).json({ error: "CURP ya registrada" });
        }

        // Generar número de socio
        const count = await client.query(
            "SELECT COUNT(*) FROM socios WHERE tipo = $1",
            [datos.tipo]
        );

        const total = parseInt(count.rows[0].count) + 1;
        const prefijo = datos.tipo === 'Accionista' ? 'ACC' : 'RNT';
        const numero_socio = `${prefijo}-${String(total).padStart(3, '0')}`;

        // Insert adaptado a los 3 campos de nombre y requerimientos del ER
        const insert = await client.query(
            `INSERT INTO socios (nombre, apellido_paterno, apellido_materno, tipo, modalidad, fecha_nacimiento, genero, email, telefono, curp, numero_socio)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING socio_id`,
            [datos.nombre, datos.apellido_paterno, datos.apellido_materno, datos.tipo, datos.modalidad, datos.fecha_nacimiento, datos.genero, datos.email, datos.telefono, datos.curp, numero_socio]
        );

        // Guardado de logs del sistema
        if (req.user && req.user.usuario_id) {
            await client.query(
                `INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada)
                 VALUES ($1, 'CREATE_SOCIO', 'socios')`,
                [req.user.usuario_id]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            exito: true,
            socio_id: insert.rows[0].socio_id,
            numero_socio
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("CHISME DE LA BASE DE DATOS:", err);
        res.status(500).json({ error: "Error interno" });
    } finally {
        client.release();
    }
};

const editarSocio = async (req, res) => {
    const client = await pool.connect();
    const { id } = req.params;

    try {
        const result = await client.query("SELECT * FROM socios WHERE socio_id=$1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Socio no encontrado" });
        }

        const actual = result.rows[0];
        const nuevos = req.body;

        let cambios = [];
        let valores = [];
        let i = 1;

        for (let key in nuevos) {
            // Comparamos para no actualizar si el dato es el mismo
            if (nuevos[key] !== actual[key]) {
                cambios.push(`${key}=$${i}`);
                valores.push(nuevos[key]);
                i++;
            }
        }

        if (cambios.length === 0) {
            return res.json({ mensaje: "Sin cambios" });
        }

        valores.push(id);

        await client.query('BEGIN');

        await client.query(
            `UPDATE socios SET ${cambios.join(',')} WHERE socio_id=$${i}`,
            valores
        );

        // Guardado de logs para la edición
        if (req.user && req.user.usuario_id) {
            await client.query(
                `INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada)
                 VALUES ($1, 'UPDATE_SOCIO', 'socios')`,
                [req.user.usuario_id]
            );
        }

        await client.query('COMMIT');

        res.json({ mensaje: "Actualizado" });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("ERROR EN EDICIÓN:", err);
        res.status(500).json({ error: "Error interno" });
    } finally {
        client.release();
    }
};

module.exports = { crearSocio, editarSocio };