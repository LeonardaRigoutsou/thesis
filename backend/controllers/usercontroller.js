const db = require('../util/database');
const bcrypt = require('bcryptjs');

const getUsers = (req, res, next) => {
    db.User.findAll({
        order: [
            ['userId', 'ASC']
        ],
        attributes: { exclude: ['password'] }
    }).then(users => {
        if (users.length === 0) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ users });
    }).catch(err => {
        next(err);
    });
};

const createUser = (req, res, next) => {
    const { username, password, firstName, lastName, hireDate, role } = req.body;

    let hashedpassword;
    bcrypt.hash(password, 10)
        .then(password => {
            hashedpassword = password;

            db.User.findOne({
                where: {
                    username: username
                }
            }).then(user => {
                if (user) {
                    const error = new Error('User already exists.');
                    error.statusCode = 409;
                    throw error;
                }

                db.User.create({
                    username: username,
                    password: hashedpassword,
                    firstName: firstName,
                    lastName: lastName,
                    hireDate: hireDate,
                    role: role
                }).then(user => {
                    res.status(200).json({ user });
                }).catch(err => {
                    next(err);
                });
            }).catch(err => {
                next(err);
            });
        });
};

const deleteUser = (req, res, next) => {
    const userId = req.params.id;
    if (!Number.isInteger(+userId)) {
        const error = new Error('User Id is not an integer number.');
        error.statusCode = 400;
        throw error;
    }
    db.User.findOne({
        where: {
            userId: userId
        }
    }).then(userFound => {
        db.User.destroy({
            where: {
                userId: userId
            }
        }).then(user => {
            if (!user) {
                const error = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json(userFound);
        }).catch(err => {
            next(err);
        });

    }).catch(err => {
        next(err);
    });
};

const updateUser = (req, res, next) => {
    const { password } = req.body;
    const userId = req.params.id;
    bcrypt.hash(password, 10)
        .then(hashedpassword => {
            req.body.password = hashedpassword;

            if (!Number.isInteger(+userId)) {
                const error = new Error('User Id is not an integer number.');
                error.statusCode = 400;
                throw error;
            }
            db.User.update({ ...req.body }, {
                where: {
                    userId: userId
                },
                returning: true
            }).then(updatedUser => {
                res.status(200).json(updatedUser);
            }).catch(err => {
                next(err);
            });
        }).catch(err => {
            next(err);
        })
};


exports.getUsers = getUsers;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;