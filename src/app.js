const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const apiLimiter = require('./middlewares/rateLimiter');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Rate Limiting (apply to all /api routes)
app.use('/api', apiLimiter);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger API Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', routes);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
