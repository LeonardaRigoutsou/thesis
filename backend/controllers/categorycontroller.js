const { NUMBER } = require('sequelize');
const db = require('../util/database');

const getCategories = (req, res, next) => {
    db.Category.findAll({
        order: [
            ['categoryId', 'ASC']
        ]
    }).then(categories => {
        if (categories.length === 0) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ categories });
    }).catch(err => {
        next(err);
    });
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
            isAvailable: isAvailable
        });

        if (!newCategory) {
            const error = new Error('Could not create category.');
            error.statusCode = 409;
            throw error;
        }

        res.status(200).json({ newCategory });
    } catch (error) {
        return next(error);
    }
};

const deleteCategory = (req, res, next) => {
    const categoryId = req.params.id;
    if (!Number.isInteger(+categoryId)) {
        const error = new Error('Category Id is not an integer number.');
        error.statusCode = 400;
        throw error;
    }
    db.Category.findOne({
        where: {
            categoryId: categoryId
        }
    }).then(categoryFound => {
        db.Category.destroy({
            where: {
                categoryId: categoryId
            }
        }).then(category => {
            if (!category) {
                const error = new Error('Category not found.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json(categoryFound);
        }).catch(err => {
            next(err);
        });
    }).catch(err => {
        next(err);
    });
};

const updateCategory = (req, res, next) => {
    const categoryId = req.params.id;
    if (!Number.isInteger(+categoryId)) {
        const error = new Error('Category Id is not an integer number');
        error.statusCode = 400;
        throw error;
    }
    db.Category.update({ ...req.body }, {
        where: {
            categoryId: categoryId
        },
        returning: true
    }).then(updatedCategory => {
        res.status(200).json(updatedCategory);
    }).catch(err => {
        next(err);
    });
};


exports.getCategories = getCategories;
exports.createCategory = createCategory;
exports.deleteCategory = deleteCategory;
exports.updateCategory = updateCategory;