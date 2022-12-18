const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARE

// set the static files using express built-in middleware
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(`${__dirname}/public`));

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

// data sanitazation against NoSQL query injection
app.use(mongoSanitize());

// data sanitazation agains XSS
app.use(xss());

// prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// test middleware
app.use((req, res, next) => {
    req.requesTime = new Date().toISOString();
    next();
});

// mounting the routers
app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'Jonas'
    });
});

app.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    });
});

app.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// to handle all unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
