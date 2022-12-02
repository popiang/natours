const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

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
    .then(() => console.log('DB connection successful!'));

// read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// import data into database
const importData = async () => {
    try {
        await Tour.create(tours);
        // eslint-disable-next-line no-console
        console.log('Data successfully loaded!!');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
    process.exit();
};

// delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        // eslint-disable-next-line no-console
        console.log('Data successfully deleted!!');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
