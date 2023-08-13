const express = require('express');
const swagger = require('swagger-ui-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { app, server } = require('./util/socket');

const authroutes = require('./routes/authroutes');
const userroutes = require('./routes/userroutes');
const tableroutes = require('./routes/tableroutes');
const categoryroutes = require('./routes/categoryroutes');
const itemroutes = require('./routes/itemroutes');
const orderroutes = require('./routes/orderroutes');
const reservationroutes = require('./routes/reservationroutes');
const imageroutes = require('./routes/imageroutes');

const db = require('./util/database');

const swaggerConfig = require('./swagger.json');

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'dist')));
app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));
app.use('/api', authroutes);
app.use('/api', userroutes);
app.use('/api', tableroutes);
app.use('/api', categoryroutes);
app.use('/api', itemroutes);
app.use('/api', orderroutes);
app.use('/api', reservationroutes);
app.use('/api', imageroutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


//error handling
app.use((err, req, res, next) => {
    console.log(err);
    if (!err.statusCode) {
        res.status(500).json({
            message: "Internal Server Error"
        })
        return;
    }
    res.status(err.statusCode).json({
        message: err.message
    });
});

db.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

db.sequelize
    .sync()
    // .sync({ alter: true })
    .then(result => {
        server.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })
