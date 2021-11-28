const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const orderController = require('../controllers/order.controller');

router.get('/', orderController.getOrders);
router.post('/', auth.required, orderController.postOrder);
router.get('/:orderId', orderController.getOrderDetail);
router.patch('/:orderId', auth.required, orderController.updateOrder);
router.delete('/:orderId', auth.required, orderController.deleteOrder);

module.exports = router;