const express = require('express');
const swagger = require('swagger-ui-express');
const bodyParser = require('body-parser');

const authroutes = require('./routes/authroutes');

const db = require('./util/database');

const swaggerConfig = require('./swagger.json');

const app = express();

app.use(bodyParser.json());
app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));
app.use(authroutes);

db.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

db.sequelize
    .sync()
    .then(result => {
        app.listen(8080, 'localhost');
    })
    .catch(err => {
        console.log(err);
    })
