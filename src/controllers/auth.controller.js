const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.register = async (req, res) => {
    const { nombre, email, password, telefono } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await db.query(
    `INSERT INTO users (nombre, email, password, telefono, role_id)
    VALUES (?, ?, ?, ?, 2)`,
    [nombre, email, hash, telefono]
    );
    
    res.statu(201).json({ message: 'Usuario registrado exitosamente' })
};
