const express = require('express');

const { authenticate, authorize } = require('../middleware/authmiddleware');
const userController = require('../controllers/usercontroller');

const router = express.Router();

router.get('/users', authenticate, authorize(['admin']), userController.getUsers);

router.post('/user', authenticate, authorize(['admin']), userController.createUser);

router.delete('/user/:id', authenticate, authorize(['admin']), userController.deleteUser);

router.put('/user/:id', authenticate, authorize(['admin']), userController.updateUser);

module.exports = router;