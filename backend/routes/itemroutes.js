const express = require('express');

const { authenticate, authorize } = require('../middleware/authmiddleware');
const itemController = require('../controllers/itemcontroller');

const router = express.Router();

router.get('/items', authenticate, authorize(['server', 'admin']), itemController.getItems);

router.post('/item', authenticate, authorize(['admin']), itemController.createItem);

router.delete('/item/:id', authenticate, authorize(['admin']), itemController.deleteItem);

router.put('/item/:id', authenticate, authorize(['admin']), itemController.updateItem);

module.exports = router;