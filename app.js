const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE

// HTTP request logger middleware for node.js
app.use(morgan('dev'));

// to modify the incoming req data
// data from body is added into req object
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// custom middleware
app.use((req, res, next) => {
	console.log('Hello from the middleware 💥');
	next();
});

app.use((req, res, next) => {
	req.requesTime = new Date().toISOString();
	next();
});

// 2) ROUTES

// mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
