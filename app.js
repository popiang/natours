const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARE

// set the static files using express built-in middleware
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(`${__dirname}/public`));

// set security http headers
// app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'data:', 'blob:'],
            baseUri: ["'self'"],
            fontSrc: ["'self'", 'https:', 'data:'],
            // scriptSrc: ["'self'", 'https://*.cloudflare.com'],
            // scriptSrc: ["'self'", 'https://*.stripe.com'],
            scriptSrc: ["'self'", 'https://*.mapbox.com'],
            frameSrc: ["'self'", 'https://*.stripe.com'],
            objectSrc: ["'none'"],
            styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
            workerSrc: ["'self'", 'data:', 'blob:'],
            childSrc: ["'self'", 'blob:'],
            imgSrc: ["'self'", 'data:', 'blob:'],
            connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
            upgradeInsecureRequests: []
        }
    })
);

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
app.use(cookieParser());

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
    // eslint-disable-next-line no-console
    console.log(req.cookies);
    next();
});

// mounting the routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// to handle all unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
