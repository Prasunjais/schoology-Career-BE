require('dotenv/config');
const express = require('express');
const middlewares = require('./src/middleware');
const app = express();
const glob = require('glob');

// custom logger 
const appLogger = require('./src/utils/logger');
global.__basedir = __dirname;
app.use(appLogger.requestDetails(appLogger));

// const authenticate = require('./utils/authenticate');
app.enable('trust proxy');
middlewares(app);

/* Router setup */
const openRouter = express.Router(); // Open routes
const apiRouter = express.Router(); // Protected routes

/* Fetch router files and apply them to our routers */
glob('./src/components/*', null, (err, items) => {
  items.forEach(component => {
    if (require(component).routes) require(component).routes(
      openRouter,
      apiRouter,
    );
  });
});

// Admin Panel Routes
app.use('/v1', openRouter);
app.use('/api/v1', apiRouter);

// swagger 
var swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./src/utils/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// handle 404
app.use(function (req, res, next) {
  res.status(404);

  // respond with html page
  return res.status(404).json({
    status: 404,
    message: 'API NOT FOUND! Please check the endpoint and the HTTP request type! or contact at prasunjais@gmail.com',
    data: {
      url: req.url
    }
  });
});

// exporting the app
module.exports = app;
