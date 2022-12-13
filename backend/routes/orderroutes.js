const express = require('express');

const { authenticate, authorize } = require('../middleware/authmiddleware');
const orderController = require('../controllers/ordercontroller');
const { route } = require('./authroutes');

const router = express.Router();

router.get('/orders', authenticate, authorize(['cook', 'admin']), orderController.getOrders);
router.get('/order/:id', authenticate, authorize(['server', 'cook', 'admin']), orderController.getOrderById);

router.post('/order', authenticate, authorize(['server']), orderController.createOrder);

router.put('/order/:id', authenticate, authorize(['server', 'cook']), orderController.updateOrder);


module.exports = router;