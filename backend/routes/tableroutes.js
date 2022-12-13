const express = require('express');

const { authenticate, authorize } = require('../middleware/authmiddleware');
const tableController = require('../controllers/tablecontroller');

const router = express.Router();

router.get('/tables', authenticate, authorize(['server', 'admin']), tableController.getTables);

router.post('/table', authenticate, authorize(['admin']), tableController.createTable);

router.put('/table/:tableNum', authenticate, authorize(['admin']), tableController.updateTable);

router.delete('/table/:tableNum', authenticate, authorize(['admin']), tableController.deleteTable);

module.exports = router;