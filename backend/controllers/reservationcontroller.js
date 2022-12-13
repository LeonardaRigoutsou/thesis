const db = require('../util/database');

const getReservations = (req, res, next) => {
    db.Reservation.findAll({
        order: [
            ['reservationId', 'ASC']
        ]
    }).then(reservations => {
        if (reservations.length === 0) {
            const error = new Error('Reservation not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ reservations });
    }).catch(err => {
        next(err);
    });
};

const getReservationsByTableNum = async (req, res, next) => {
    const tableNum = req.params.tableNum;

    try {
        const table = await db.Table.findOne({
            where: {
                tableNum: tableNum
            }
        });

        if (!table) {
            const error = new Error('Table does not exist.');
            error.statusCode = 409;
            throw error;
        }

        const reservations = await db.Reservation.findAll({
            where: {
                tableNum: tableNum
            }
        });

        res.status(200).json({ reservations });
    } catch (error) {
        next(error);
    }
};

const createReservation = async (req, res, next) => {
    const { tableNum, reservationName, reservationDate } = req.body;

    try {
        const reservation = await db.Reservation.findOne({
            where: {
                tableNum: tableNum,
                reservationDate: reservationDate
            }
        });

        if (reservation) {
            const error = new Error('Reservation already exists.');
            error.statusCode = 409;
            throw error;
        }

        const table = await db.Table.findOne({
            where: {
                tableNum: tableNum
            }
        });

        if (!table) {
            const error = new Error('Table number does not exist.');
            error.statusCode = 409;
            throw error;
        }

        const newReservation = await db.Reservation.create({
            tableNum: tableNum,
            reservationName: reservationName,
            reservationDate: reservationDate
        });

        if (!newReservation) {
            const error = new Error('Could not create reservation.');
            error.statusCode = 409;
            throw error;
        }

        res.status(200).json({ newReservation });
    } catch (error) {
        return next(error);
    }
};

const deleteReservation = (req, res, next) => {
    const reservationId = req.params.id;
    if (!Number.isInteger(+reservationId)) {
        const error = new Error('Reservation id is not an integer number.');
        error.statusCode = 400;
        throw error;
    }
    db.Reservation.findOne({
        where: {
            reservationId: reservationId
        }
    }).then(reservationFound => {
        db.Reservation.destroy({
            where: {
                reservationId: reservationId
            }
        }).then(reservation => {
            if (!reservation) {
                const error = new Error('Reservation not found.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json(reservationFound);
        }).catch(err => {
            next(err);
        });
    }).catch(err => {
        next(err);
    });
};

const updateReservation = (req, res, next) => {
    const reservationId = req.params.id;
    if (!Number.isInteger(+reservationId)) {
        const error = new Error('Reservation Id is not an integer number');
        error.statusCode = 400;
        throw error;
    }
    db.Table.findOne({
        where: {
            tableNum: req.body.tableNum
        }
    }).then(tableFound => {
        if (!tableFound) {
            const error = new Error('Table does not exists.');
            error.statusCode = 404;
            throw error;
        }

        db.Reservation.update({ ...req.body }, {
            where: {
                reservationId: reservationId
            },
            returning: true
        }).then(updatedReservation => {
            res.status(200).json(updatedReservation);
        }).catch(err => {
            next(err);
        });
    }).catch(err => {
        next(err);
    });
};

exports.getReservations = getReservations;
exports.getReservationsByTableNum = getReservationsByTableNum;
exports.createReservation = createReservation;
exports.deleteReservation = deleteReservation;
exports.updateReservation = updateReservation;