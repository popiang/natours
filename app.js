const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE

// set security http headers
app.use(helmet());

// HTTP request logger middleware for development environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit request of API call from the same IP address
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// to modify the incoming req data
// data from body is added into req object
app.use(express.json({ limit: '10kb' }));

// set the static files using express built-in middleware
app.use(express.static(`${__dirname}/public`));

// test middleware
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
