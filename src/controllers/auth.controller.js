const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (nombre, email, password, telefono, role_id)
    VALUES (?, ?, ?, ?, 2)`,
    [nombre, email, hash, telefono]
  );

  res.statu(201).json({ message: "Usuario registrado exitosamente" });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND estado = "activo"',
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
