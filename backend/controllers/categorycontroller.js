const db = require('../util/database');

const getCategories = async (req, res, next) => {

    try {
        const categories = await db.Category.findAll({
            order: [
                ['categoryId', 'ASC']
            ]
        });

        if (categories.length === 0) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ categories });
    } catch (err) {
        next(err);
    };
};

const createCategory = async (req, res, next) => {
    const { name, isAvailable } = req.body;

    try {
        const category = await db.Category.findOne({
            where: {
                name: name
            }
        });

        if (category) {
            const error = new Error('Category already exists.');
            error.statusCode = 409;
            throw error;
        }

        const newCategory = await db.Category.create({
            name: name,
            isAvailable: !!isAvailable ? isAvailable : false,
        });

        if (!newCategory) {
            const error = new Error('Could not create category.');
            error.statusCode = 409;
            throw error;
        }

        res.status(200).json({ category: newCategory });
    } catch (error) {
        return next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;

    if (!Number.isInteger(+categoryId)) {
        const error = new Error('Category Id is not an integer number.');
        error.statusCode = 400;
        throw error;
    }

    try {
        const categoryFound = await db.Category.findOne({
            where: {
                categoryId: categoryId
            }
        });

        if (!categoryFound) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            throw error;
        }

        const categoryDestroyed = await db.Category.destroy({
            where: {
                categoryId: categoryId
            }
        });

        if (!categoryDestroyed) {
            const error = new Error('Could not delete category');
            error.statusCode = 409;
            throw error;
        }

        res.status(200).json({ category: categoryFound });
    } catch (err) {
        next(err);
    };
};

const updateCategory = async (req, res, next) => {
    const categoryId = req.params.id;

    if (!Number.isInteger(+categoryId)) {
        const error = new Error('Category Id is not an integer number');
        error.statusCode = 400;
        throw error;
    }

    try {

        const updatedCategory = await db.Category.update({ ...req.body }, {
            where: {
                categoryId: categoryId
            },
            returning: true
        });

        if (!updatedCategory) {
            const error = new Error('Could not update category');
            error.statusCode = 409;
            throw error;
        }

        res.status(200).json({ category: updatedCategory });
    } catch (err) {
        next(err);
    };
};


exports.getCategories = getCategories;
exports.createCategory = createCategory;
exports.deleteCategory = deleteCategory;
exports.updateCategory = updateCategory;