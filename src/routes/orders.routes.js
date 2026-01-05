router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.history);