const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../util/database');

const login = (req, res, next) => {
    const { username, password } = req.body;
    let loadedUser;

    if (!username) {
        return res.status(400).json({ message: 'Username does not exist.' });
    }

    2if (!password) {
        return res.status(400).json({ message: 'Password does not exist.' });
    }

    db.User.findAll({
        where: {
            username: username
        }
    }).then(users => {
        if (!users) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        return users[0];
    }).then(user => {
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error('Incorrect password.');
            error.statusCode = 404;
            throw error;
        }
        const token = jwt.sign({
            username: loadedUser.username,
            userId: loadedUser.userId.toString(),
            role: loadedUser.role
        },
            'testsercetkey'
        );
        res.status(200).json({ token: token, userId: loadedUser.userId.toString() });
    }).catch(err => {
        next(err);
    });
}

module.exports = login;