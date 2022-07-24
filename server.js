const mongoose = require('mongoose');
const dotenv = require('dotenv');

// to read the variables in the config file and save it in the node js environment variables
dotenv.config({ path: `./config.env` });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

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
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App is running on port ${port}`);
});
