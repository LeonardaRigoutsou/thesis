const { Op } = require('sequelize');
const db = require('../util/database');

const getOrders = async (req, res, next) => {

    try {
        const fetchedOrders = await db.Order.findAll({
            order: [
                ['orderId', 'ASC']
            ],
            include: { model: db.Item }
        });

        if (!fetchedOrders) {
            const error = new Error('Could not find orders.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ fetchedOrders });
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const order = await db.Order.findOne({
            where: {
                orderId: orderId
            },
            include: { model: db.Item }
        });

        if (!order) {
            const error = new Error('Order not found.');
            error.statusCode = 404;
            throw error;
        }

        // const orderItems = await db.OrderItem.findAll({
        //     where: {
        //         orderId: order.orderId
        //     }
        // });

        res.status(200).json({ order });
    } catch (error) {
        next(error);
    }
};

const createOrder = async (req, res, next) => {
    const { serverId, tableNum, orderDate, instructions, items } = req.body;

    try {
        const order = await db.Order.findOne({
            where: {
                serverId: serverId,
                tableNum: tableNum,
                [Op.or]: [
                    {
                        state: db.states.open
                    },
                    {
                        state: db.states.made
                    }
                ]
            }
        });

        if (order) {
            const error = new Error('An order already exists on this table.');
            error.statusCode = 409;
            throw error;
        }

        const server = await db.User.findOne({
            where: {
                userId: serverId
            }
        });

        if (!server) {
            const error = new Error('Server does not exist.');
            error.statusCode = 409;
            throw error;
        }

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

        const newOrder = await db.Order.create({
            serverId: serverId,
            tableNum: tableNum,
            orderDate: orderDate,
            state: db.states.open,
            instructions: instructions
        });

        if (!newOrder) {
            const error = new Error('Could not create order.');
            error.statusCode = 409;
            throw error;
        }

        if (!items) {
            const error = new Error('Please enter at least one item.');
            error.statusCode = 400;
            throw error;
        }

        let orderedItems = [];
        for (const item of items) {
            let fetchedItem = await db.Item.findOne({
                where: {
                    itemId: item.itemId
                }
            })

            if (!fetchedItem) {
                const error = new Error('Item does not exist.');
                error.statusCode = 404;
                throw error;
            }

            let orderItem = await db.OrderItem.create({
                itemId: item.itemId,
                orderId: newOrder.orderId,
                status: db.states.open,
                quantity: item.quantity,
                qualifiers: item.qualifiers
            })

            if (!orderItem) {
                const error = new Error('Could not create orderItem.');
                error.statusCode = 409;
                throw error;
            }

            orderedItems.push(orderItem);
        }

        res.status(200).json({ ...newOrder.dataValues, items: orderedItems });
    } catch (error) {
        return next(error);
    }
};

const updateOrder = async (req, res, next) => {
    const { serverId, tableNum, orderDate, state, instructions, items } = req.body;
    const orderId = req.params.id;

    try {
        const order = await db.Order.findOne({
            where: {
                orderId: orderId
            }
        });

        if (!order) {
            const error = new Error('Order does not exist.');
            error.statusCode = 409;
            throw error;
        }

        const server = await db.User.findOne({
            where: {
                userId: serverId
            }
        });

        if (!server) {
            const error = new Error('Server does not exist.');
            error.statusCode = 409;
            throw error;
        }

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

        const updatedOrder = await db.Order.update({
            serverId, tableNum, orderDate, state, instructions
        }, {
            where: {
                orderId: orderId
            },
            returning: true
        });

        if (!updatedOrder) {
            const error = new Error('Could not update order.');
            error.statusCode = 409;
            throw error;
        }

        if (!items) {
            const error = new Error('Please enter at least one item.');
            error.statusCode = 400;
            throw error;
        }

        let orderedItems = [];
        for (const item of items) {
            let fetchedItem = await db.Item.findOne({
                where: {
                    itemId: item.itemId
                }
            })

            if (!fetchedItem) {
                const error = new Error('Item does not exist.');
                error.statusCode = 404;
                throw error;
            }

            let orderItem = await db.OrderItem.findOne({
                where: {
                    orderId: orderId,
                    itemId: item.itemId
                }
            });

            let orderedItem;
            if (!orderItem) {
                orderedItem = await db.OrderItem.create({
                    itemId: item.itemId,
                    orderId: orderId,
                    status: db.states.open,
                    quantity: item.quantity,
                    qualifiers: item.qualifiers
                });

                if (!orderedItem) {
                    const error = new Error('Could not create new order item');
                    error.statusCode = 409;
                    throw error;
                }

                orderedItems.push(orderItem[0].dataValues);
            } else {
                orderedItem = await db.OrderItem.update({
                    itemId: item.itemId,
                    status: item.status,
                    quantity: item.quantity,
                    qualifiers: item.qualifiers
                }, {
                    where: {
                        orderId: orderId,
                        itemId: item.itemId
                    },
                    returning: true
                });

                if (!orderedItem) {
                    const error = new Error('Could not update the ordered item.');
                    error.statusCode = 409;
                    throw error;
                }

                orderedItems.push(orderedItem[1][0].dataValues);
            }
        }
        res.status(200).json({ ...updatedOrder[1][0].dataValues, items: orderedItems });
    } catch (error) {
        return next(error);
    }
};

exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.createOrder = createOrder;
exports.updateOrder = updateOrder;
