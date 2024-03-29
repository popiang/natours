const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

// create tour schema
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less or equal then 40 characters'
            ],
            minlength: [
                10,
                'A tour name must have more or equal then 10 characters'
            ]
            // validate: [
            //     validator.isAlpha,
            //     'Tour name must only contains characters'
            // ]
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty has to be easy, medium or difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be equal or above 1.0'],
            max: [5, 'Rating must be equal or below 5.0']
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    // this only points to current doc on NEW document creation
                    return val < this.price;
                },
                message:
                    'Discount price ({VALUE}) should be below the regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have an image cover']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        // guides: Array
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

// DOCUMENT MIDDLEWARE : runs before .save and .create, not on others such as .insertMany
tourSchema.pre('save', function(next) {
    // eslint-disable-next-line no-console
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    // eslint-disable-next-line no-console
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    // eslint-disable-next-line no-console
    // console.log(docs);
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangeAt'
    });

    next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//     // eslint-disable-next-line no-console
//     // console.log(this.pipeline());
//     next();
// });

// use the tour schema to create tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
