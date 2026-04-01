const pool = require('../config/database');
const { validarSocio } = require('./validacionSocios');
const { validarCURP } = require('../utils/validacionCurp');

const crearSocio = async (req, res) => {
    const datos = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        curp: req.body.curp,
        tipo_socio: req.body.tipo_socio,
        modalidad: req.body.modalidad
    };

    const validacion = validarSocio(datos);

    if (!validacion.valido) {
        return res.status(400).json({ errores: validacion.errores });
    }

    if (!validarCURP(datos.curp)) {
        return res.status(400).json({ error: "CURP inválida" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // CURP única
        const existe = await client.query(
            "SELECT * FROM socios WHERE curp = $1",
            [datos.curp]
        );

        if (existe.rows.length > 0) {
            return res.status(409).json({ error: "CURP ya registrada" });
        }

        // número socio
        const count = await client.query(
            "SELECT COUNT(*) FROM socios WHERE tipo_socio = $1",
            [datos.tipo_socio]
        );

        const total = parseInt(count.rows[0].count) + 1;
        const prefijo = datos.tipo_socio === 'accionista' ? 'ACC' : 'RNT';
        const numero_socio = `${prefijo}-${String(total).padStart(3, '0')}`;

        const insert = await client.query(
            `INSERT INTO socios (nombre, apellido, curp, tipo_socio, modalidad, numero_socio)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
            [datos.nombre, datos.apellido, datos.curp, datos.tipo_socio, datos.modalidad, numero_socio]
        );

// Blindaje: Solo intenta guardar en el historial si detecta un usuario
        if (req.user && req.user.usuario_id) {
            await client.query(
                `INSERT INTO audit_logs (usuario_id, entidad, entidad_id, tipo_evento)
                 VALUES ($1,'socios',$2,'CREATE_SOCIO')`,
                [req.user.usuario_id, insert.rows[0].id]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            exito: true,
            socio_id: insert.rows[0].id,
            numero_socio
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.log("CHISME DE LA BASE DE DATOS:", err); // <-- Agrega esta línea
        res.status(500).json({ error: "Error interno" });
    } finally {
        client.release();
    }
};
const editarSocio = async (req, res) => {
    const client = await pool.connect();
    const { id } = req.params;

    try {
        const result = await client.query("SELECT * FROM socios WHERE id=$1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Socio no encontrado" });
        }

        const actual = result.rows[0];
        const nuevos = req.body;

        let cambios = [];
        let valores = [];
        let i = 1;

        for (let key in nuevos) {
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
            `UPDATE socios SET ${cambios.join(',')} WHERE id=$${i}`,
            valores
        );

        await client.query(
            `INSERT INTO audit_logs (usuario_id, entidad, entidad_id, tipo_evento)
             VALUES ($1,'socios',$2,'UPDATE_SOCIO')`,
            [req.user.usuario_id, id]
        );

        await client.query('COMMIT');

        res.json({ mensaje: "Actualizado" });

    } catch {
        await client.query('ROLLBACK');
        res.status(500).json({ error: "Error" });
    } finally {
        client.release();
    }
};

module.exports = { crearSocio, editarSocio };