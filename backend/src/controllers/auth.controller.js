const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  // Tu frontend manda 'email', pero lo vamos a buscar en la columna 'username'
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: "Usuario y contraseña requeridos" });
  }

  try {
    // Ajustado a tus nombres de columnas (username, rol_id, usuario_id)
    const result = await pool.query(
      `SELECT u.*, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.rol_id
       WHERE u.username = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });
    if (!user.activo) return res.status(403).json({ error: "Cuenta desactivada" });

    // Ajustado para leer 'password_hash'
    const match = await bcrypt.compare(contrasena, user.password_hash);

    if (!match) return res.status(401).json({ error: "Credenciales incorrectas" });

    // Ajustado para usar usuario_id y username
    const token = jwt.sign(
      {
        usuario_id: user.usuario_id,
        rol: user.rol,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { username: user.username, rol: user.rol } });

  } catch (error) {
    console.error("💥 ERROR EN EL LOGIN:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};