const express = require('express');
const db = require('../util/database');

const { authenticate, authorize } = require('../middleware/authmiddleware');
const categoryController = require('../controllers/categorycontroller');

const router = express.Router();

router.get('/categories', authenticate, authorize(['server', 'admin']), categoryController.getCategories);

router.post('/category', authenticate, authorize(['admin']), categoryController.createCategory);

router.delete('/category/:id', authenticate, authorize(['admin']), categoryController.deleteCategory);

router.put('/category/:id', authenticate, authorize(['admin']), categoryController.updateCategory);

module.exports = router;