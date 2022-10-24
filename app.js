const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE

// HTTP request logger middleware for node.js
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

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
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

module.exports = app;
