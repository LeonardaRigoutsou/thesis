const db = require('../util/database');

const getItems = (req, res, next) => {
    db.Item.findAll({
        order: [
            ['itemId', 'ASC']
        ]
    }).then(items => {
        if (items.length === 0) {
            const error = new Error('Item not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ items });
    }).catch(err => {
        next(err);
    });
};

const getItemsByCategoryId = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        if (!Number.isInteger(+categoryId)) {
            const error = new Error('Category Id is not an integer number.');
            error.statusCode = 400;
            throw error;
        }

        const items = await db.Item.findAll({
            where: {
                categoryId: categoryId
            }
        });

        if (!items) {
            const error = new Error('Items not found.');
            error.statusCode = 404;
            throw error;
        }

        console.log(items);
        res.status(200).json({ items });
    } catch (error) {
        next(error);
    }
}

const createItem = async (req, res, next) => {
    const { categoryId, title, price, isAvailable, ingredients } = req.body;

    try {
        const item = await db.Item.findOne({
            where: {
                title: title
            }
        });

        if (item) {
            const error = new Error('Item already exists.');
            error.statusCode = 409;
            throw error;
        }

        const newItem = await db.Item.create({
            categoryId: categoryId,
            title: title,
            price: price,
            isAvailable: isAvailable,
            ingredients: ingredients
        });

        if (!newItem) {
            const error = new Error('Could not create item.');
            error.statusCode = 409;
            throw error;
        }

        res.status(200).json({ newItem });
    } catch (error) {
        return next(error);
    }
};

const deleteItem = (req, res, next) => {
    const itemId = req.params.id;
    if (!Number.isInteger(+itemId)) {
        const error = new Error('Item Id is not an integer number.');
        error.statusCode = 400;
        throw error;
    }
    db.Item.findOne({
        where: {
            itemId: itemId
        }
    }).then(itemFound => {
        db.Item.destroy({
            where: {
                itemId: itemId
            }
        }).then(item => {
            if (!item) {
                const error = new Error('Item not found.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json(itemFound);
        }).catch(err => {
            next(err);
        });
    }).catch(err => {
        next(err);
    });
};

const updateItem = (req, res, next) => {
    const itemId = req.params.id;
    if (!Number.isInteger(+itemId)) {
        const error = new Error('Item Id is not an integer number');
        error.statusCode = 400;
        throw error;
    }
    db.Item.update({ ...req.body }, {
        where: {
            itemId: itemId
        },
        returning: true
    }).then(updatedItem => {
        res.status(200).json(updatedItem);
    }).catch(err => {
        next(err);
    });
};

exports.getItems = getItems;
exports.createItem = createItem;
exports.deleteItem = deleteItem;
exports.updateItem = updateItem;
exports.getItemsByCategoryId = getItemsByCategoryId;