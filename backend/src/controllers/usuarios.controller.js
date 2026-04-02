const pool = require('../config/database');
const bcrypt = require('bcrypt');

exports.crearUsuario = async (req, res) => {
  try {
    const { email, nombre, rol_id, contrasena } = req.body;

    // Se busca en la columna username usando el email que manda el frontend
    const existe = await pool.query(
      "SELECT usuario_id FROM usuarios WHERE username=$1",
      [email]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    // Se inserta en las columnas correctas de Neon y se retorna usuario_id
    const result = await pool.query(
      `INSERT INTO usuarios (username, nombre, rol_id, password_hash)
       VALUES ($1, $2, $3, $4) RETURNING usuario_id`,
      [email, nombre, rol_id, hash]
    );

    res.status(201).json({
      usuario_id: result.rows[0].usuario_id,
      email,
      nombre
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// GET /api/usuarios-internos
const listarUsuarios = async (req, res) => {
    try {
        const { rol, activo } = req.query;
        // Ya incluimos u.nombre y mandamos username como email
        let query = `
            SELECT u.usuario_id, u.nombre, u.username AS email, r.nombre_rol AS rol, u.activo
            FROM usuarios u
            JOIN roles r ON u.rol_id = r.rol_id
            WHERE 1=1
        `;
        const params = [];

        if (rol) {
            params.push(rol);
            query += ` AND u.rol_id = $${params.length}`;
        }

        if (activo !== undefined) {
            // Conversión a booleano para el campo de Postgres
            const isActivo = activo == 1 || activo === 'true'; 
            params.push(isActivo); 
            query += ` AND u.activo = $${params.length}`;
        }

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// PUT /api/usuarios-internos/:id
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol_id, nueva_contrasena } = req.body;
    const adminId = req.user.usuario_id; 

    try {
        const emailCheck = await pool.query(
            'SELECT usuario_id FROM usuarios WHERE username = $1 AND usuario_id != $2', 
            [email, id]
        );
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const rolCheck = await pool.query('SELECT rol_id FROM roles WHERE rol_id = $1', [rol_id]);
        if (rolCheck.rows.length === 0) {
            return res.status(400).json({ error: 'El rol no existe' });
        }

        await pool.query('BEGIN');

        // Ya procesamos el nombre directamente
        let updateSql = 'UPDATE usuarios SET nombre = $1, username = $2, rol_id = $3';
        const updateParams = [nombre, email, rol_id];

        if (nueva_contrasena) {
            if (nueva_contrasena.length < 8) {
                await pool.query('ROLLBACK');
                return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
            }
            const hash = await bcrypt.hash(nueva_contrasena, 10);
            updateSql += ', password_hash = $4'; 
            updateParams.push(hash);
            
            updateSql += ` WHERE usuario_id = $5`;
            updateParams.push(id);
        } else {
            updateSql += ` WHERE usuario_id = $4`;
            updateParams.push(id);
        }

        await pool.query(updateSql, updateParams);

        await pool.query(`
            INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada)
            VALUES ($1, $2, $3)
        `, [adminId, `USUARIO_ACTUALIZADO - Entidad ID: ${id}`, 'usuarios']);

        await pool.query('COMMIT');
        res.json({ mensaje: 'Usuario actualizado correctamente' });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// PATCH /api/usuarios-internos/:id/estado
const cambiarEstadoUsuario = async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;
    const adminId = req.user.usuario_id;

    if (parseInt(adminId) === parseInt(id)) {
        return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });
    }

    try {
        const isActivo = activo == 1 || activo === true;

        await pool.query('BEGIN');

        await pool.query(
            'UPDATE usuarios SET activo = $1 WHERE usuario_id = $2', 
            [isActivo, id]
        );

        await pool.query(`
            INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada)
            VALUES ($1, $2, $3)
        `, [adminId, `USUARIO_CAMBIO_ESTADO - Entidad ID: ${id} - Nuevo estado: ${isActivo}`, 'usuarios']);

        await pool.query('COMMIT');
        res.json({ mensaje: 'Estado del usuario actualizado correctamente' });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    listarUsuarios,
    actualizarUsuario,
    cambiarEstadoUsuario,
};