const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token requerido.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido.' });
    }
};

module.exports = (req, res, next)=>{
    if (req.user.role_id !== 1) {
        return res.status(403).json({ message: 'Acceso denegado.' });
    }
    next();
};

    