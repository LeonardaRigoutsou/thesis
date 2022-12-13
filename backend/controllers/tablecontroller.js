const { Op } = require('sequelize');
const db = require('../util/database');

const getTables = (req, res, next) => {
    db.Table.findAll({
        order: [
            ['tableNum', 'ASC'],
        ]
    }).then(tables => {
        if (tables.length === 0) {
            const error = new Error('Table not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ tables });
    }).catch(err => {
        next(err);
    });
};

const createTable = async (req, res, next) => {
    const table = req.body;

    try {
        const existingTableNum = await db.Table.findOne({
            where: {
                tableNum: table.tableNum
            }
        });

        if (existingTableNum) {
            const error = new Error('Table number already exists.');
            error.statusCode = 409;
            throw error;
        }

        const existingTableLocation = await db.Table.findOne({
            where: {
                locationX: table.locationX,
                locationY: table.locationY
            }
        });

        if (existingTableLocation.locationX === table.locationX && existingTableLocation.locationY === table.locationY) {
            const error = new Error('Table already exists in this location.');
            error.statusCode = 409;
            throw error;
        }



        const createdTable = await db.Table.create({
            tableNum: table.tableNum,
            seats: table.seats,
            locationX: table.locationX,
            locationY: table.locationY
        });

        if (!createdTable) {
            const error = new Error('Could not create tables');
            error.statusCode = 409;
            throw error;
        }

        res.status(200).json(createdTable);
    } catch (error) {
        next(error);
    }

};

const updateTable = async (req, res, next) => {
    const table = req.body;
    const tableNum = req.params.tableNum;

    try {
        let existingTable = await db.Table.findOne({
            where: {
                tableNum: tableNum
            }
        });

        if (!existingTable) {
            const error = new Error('Table does not exist.');
            error.statusCode = 409;
            throw error;
        }

        existingTable = await db.Table.findOne({
            where: {
                [Op.or]: {
                    tableNum: table.tableNum,
                    [Op.and]: {
                        locationX: table.locationX,
                        locationY: table.locationY
                    }

                }
            }
        });

        if (existingTable) {
            const error = new Error('Table already exists on this location.');
            error.statusCode = 409;
            throw error;
        }

        let updatedTable = await db.Table.update({
            tableNum: table.tableNum,
            seats: table.seats,
            locationX: table.locationX,
            locationY: table.locationY
        }, {
            where: {
                tableNum: tableNum,
            }
        });

        if (!updatedTable) {
            const error = new Error('Could not update table.');
            error.statusCode = 409;
            throw error;
        }

        res.status(200).json(updatedTable);
    } catch (error) {
        next(error);
    }
}

const deleteTable = (req, res, next) => {
    const tableNum = req.params.tableNum;
    if (!Number.isInteger(+tableNum)) {
        const error = new Error('Table number is not an integer number.');
        error.statusCode = 400;
        throw error;
    }
    db.Table.findOne({
        where: {
            tableNum: tableNum
        }
    }).then(tableFound => {
        db.Table.destroy({
            where: {
                tableNum: tableNum
            }
        }).then(table => {
            if (!table) {
                const error = new Error('Table not found.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json(tableFound);
        }).catch(err => {
            next(err);
        });
    }).catch(err => {
        next(err);
    });
};

exports.getTables = getTables;
exports.createTable = createTable;
exports.updateTable = updateTable;
exports.deleteTable = deleteTable;
