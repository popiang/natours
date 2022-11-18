const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body);

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangeAt: req.body.passwordChangeAt,
        role: req.body.role
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) check if user exists && password is correct
    // add select password to add password into the result of findOne
    // use +password, because in userModel we have set the field password select as false
    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password!', 401));
    }

    // 3) if everything is ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1. get the token and check if it's exist
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in. Please login to get access',
                401
            )
        );
    }

    // 2. varification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to the token is no longer exist',
                401
            )
        );
    }

    // 4. check if user changed password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User changed password recently. Please log in again',
                401
            )
        );
    }

    // grant access to protected route
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles are in an array
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403
                )
            );
        }

        next();
    };
};
