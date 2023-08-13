const express = require('express');

const { authenticate, authorize } = require('../middleware/authmiddleware');
const orderController = require('../controllers/ordercontroller');
const { route } = require('./authroutes');

const router = express.Router();

router.get('/orders', authenticate, authorize(['cooker', 'admin']), orderController.getOrders);
router.get('/order/:id', authenticate, authorize(['server', 'cooker', 'admin']), orderController.getOrderById);
router.get('/order/table/:tableId', authenticate, authorize(['server', 'cooker', 'admin']), orderController.getOrderByTableNum);

router.post('/order', authenticate, authorize(['server']), orderController.createOrder);

router.put('/order/:id', authenticate, authorize(['server', 'cooker']), orderController.updateOrder);


module.exports = router;