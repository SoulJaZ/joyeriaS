exports.addItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id, cantidad } = req.body;
  // Llama al service
};
