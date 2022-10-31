const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    // eslint-disable-next-line no-console
    console.log('UNHANDLED EXCEPTION! Shutting down...');
    // eslint-disable-next-line no-console
    console.log(err.name);
    // eslint-disable-next-line no-console
    console.log(err.message);

    process.exit(1);
});

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

// START THE SERVER
const port = process.env.PORT;
const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    // eslint-disable-next-line no-console
    console.log('UNHANDLED REJECTION! Shutting down...');
    // eslint-disable-next-line no-console
    console.log(err.name);
    // eslint-disable-next-line no-console
    console.log(err.message);
    // eslint-disable-next-line no-console
    console.log(err);

    server.close(() => {
        process.exit(1);
    });
});
