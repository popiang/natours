const mongoose = require('mongoose');
const slugify = require('slugify');

// create tour schema
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true
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
            required: [true, 'A tour must have a difficulty']
        },
        ratingsAverage: {
            type: Number,
            default: 4.5
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: Number,
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
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE : runs before .save and .create, not on others such as .insertMany
tourSchema.pre('save', function(next) {
    // eslint-disable-next-line no-console
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function(next) {
//     // eslint-disable-next-line no-console
//     console.log('Will save document...');
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     // eslint-disable-next-line no-console
//     console.log(doc);
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
    console.log(docs);
    next();
});

// use the tour schema to create tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
