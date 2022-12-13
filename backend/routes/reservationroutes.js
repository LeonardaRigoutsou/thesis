const express = require('express');

const { authenticate, authorize } = require('../middleware/authmiddleware');
const reservationController = require('../controllers/reservationcontroller');

const router = express.Router();

router.get('/reservations', authenticate, authorize(['server', 'admin']), reservationController.getReservations);

router.get('/reservations/:tableNum', authenticate, authorize(['server', 'admin']), reservationController.getReservationsByTableNum);

router.post('/reservation', authenticate, authorize(['server', 'admin']), reservationController.createReservation);

router.delete('/reservation/:id', authenticate, authorize(['server', 'admin']), reservationController.deleteReservation);

router.put('/reservation/:id', authenticate, authorize(['server', 'admin']), reservationController.updateReservation);

module.exports = router;