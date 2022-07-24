const mongoose = require('mongoose');
const dotenv = require('dotenv');

// to read the variables in the config file and save it in the node js environment variables
dotenv.config({ path: `./config.env` });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// connect to mongo db in Atlas
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    // eslint-disable-next-line no-console
    .then(() => console.log(`DB connection successfull`));

// create tour schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

// use the tour schema to create tour model
const Tour = mongoose.model('Tour', tourSchema);

// create new tour - an instance of tour model
const testTour = new Tour({
    name: 'The Park Camper',
    price: 997
});

testTour
    .save()
    .then(doc => {
        console.log(doc);
    })
    .catch(err => {
        console.log('ERROR 💥', err);
    });

// START THE SERVER
const port = process.env.PORT;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App is running on port ${port}`);
});
