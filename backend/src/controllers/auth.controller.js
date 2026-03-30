const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: "Email y contraseña requeridos" });
  }

  try {
    const result = await pool.query(
      `SELECT u.*, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });
    if (!user.activo) return res.status(403).json({ error: "Cuenta desactivada" });

    const match = await bcrypt.compare(contrasena, user.contrasena);

    if (!match) return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      {
        usuario_id: user.id,
        rol: user.rol,
        nombre: user.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { nombre: user.nombre, rol: user.rol } });

  } catch {
    res.status(500).json({ error: "Error servidor" });
  }
};