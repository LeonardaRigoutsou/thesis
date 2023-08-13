const db = require('../util/database');

const getItems = (req, res, next) => {

    try {
        const items = db.Item.findAll({
            order: [
                ['itemId', 'ASC']
            ]
        });

        if (items.length === 0) {
            const error = new Error('Item not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ items });
    } catch (error) {
        next(err);
    }
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

        res.status(200).json({ item: newItem });
    } catch (error) {
        return next(error);
    }
};

const deleteItem = (req, res, next) => {
    const itemId = req.params.id;

    try {

        if (!Number.isInteger(+itemId)) {
            const error = new Error('Item Id is not an integer number.');
            error.statusCode = 400;
            throw error;
        }

        const itemFound = db.Item.findOne({
            where: {
                itemId: itemId
            }
        });

        if (!itemFound) {
            return res.status(404).json({ message: 'Could not find item to delete' });
        }

        const item = db.Item.destroy({
            where: {
                itemId: itemId
            }
        });

        if (!item) {
            const error = new Error('Item not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ item: itemFound });
    } catch (err) {
        next(err);
    };
};

const updateItem = (req, res, next) => {
    const itemId = req.params.id;

    try {

        if (!Number.isInteger(+itemId)) {
            const error = new Error('Item Id is not an integer number');
            error.statusCode = 400;
            throw error;
        }
        console.log(req.body);
        const updatedItem = db.Item.update({ ...req.body }, {
            where: {
                itemId: itemId
            },
            returning: true
        })

        res.status(200).json({ item: updatedItem });
    } catch (err) {
        next(err);
    };
};

exports.getItems = getItems;
exports.createItem = createItem;
exports.deleteItem = deleteItem;
exports.updateItem = updateItem;
exports.getItemsByCategoryId = getItemsByCategoryId;