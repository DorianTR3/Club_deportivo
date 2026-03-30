const pool = require('../config/database');
const bcrypt = require('bcrypt');

exports.crearUsuario = async (req, res) => {
  const { email, nombre, rol_id, contrasena } = req.body;

  const existe = await pool.query(
    "SELECT * FROM usuarios WHERE email=$1",
    [email]
  );

  if (existe.rows.length > 0) {
    return res.status(409).json({ error: "Email ya existe" });
  }

  const hash = await bcrypt.hash(contrasena, 10);

  const result = await pool.query(
    `INSERT INTO usuarios (email,nombre,rol_id,contrasena)
     VALUES ($1,$2,$3,$4) RETURNING id`,
    [email, nombre, rol_id, hash]
  );

  res.status(201).json({
    id: result.rows[0].id,
    email,
    nombre
  });
};