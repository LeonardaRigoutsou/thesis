const express = require('express');
const swagger = require('swagger-ui-express');

const swaggerConfig = require('./swagger.json');

const app = express();

app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));


app.listen(8080, 'localhost');