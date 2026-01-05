const db = require('../config/db');

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    
    const [[cart]] = await db.query(
    `SELECT * FROM carts WHERE user_id = ? AND estado = 'activo'`,
    [userId]
    );

    if (!cart) return res.json ({ items: [] });

    const [items] = await db.query(
        `SELECT ci.*, p.nombre
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = ?`,
        [cart.id]
    );
    res.json({ cart, items });
};

exports.addItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id, cantidad } = req.body;

  let [[cart]] = await db.query(
    `SELECT id FROM carts WHERE user_id = ? AND estado ? 'activo'`,
    [userId]
  );

  if (!cart){
    const [result] = await db.query(
        `INSERT INTO carts (user_id) VALUES(?)`,
        [userId]
    );
    cart = { id: result.insertId };
  }

  const [[product]] = await db.query(
    `SELECT precio FROM products WHERE id =? AND estado = 'disponible'`,
    [product_id]
  );

  await db.query(
    `INSERT INTO cart_items (cart_id, product_id, cantidad, precio_unitario)
    VALUES (?, ?, ?, ?)`,
    [cart.id, product_id, cantidad, product.precio]
  );
   res.status(201).json({ message: 'Producto agregado al carrito' });
  // Llama al service
};
