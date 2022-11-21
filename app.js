const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE

// HTTP request logger middleware for node.js
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// to modify the incoming req data
// data from body is added into req object
app.use(express.json());

// set the static files using express built-in middleware
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requesTime = new Date().toISOString();
    next();
});

// mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// to handle all unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
