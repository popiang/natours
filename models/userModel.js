const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is compulsory'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'User email is compulsory'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        trim: true,
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please enter a confirm password'],
        trim: true,
        minlength: 8
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
