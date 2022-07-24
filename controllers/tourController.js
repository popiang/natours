// const fs = require('fs');

const Tour = require('../models/tourModel');

// get all the tours from file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-sample.json`)
// );

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Tour name and price are compulsory'
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requesTime
        // results: tours.length,
        // data: {
        //     tours: tours
        // }
    });
};

exports.getTour = (req, res) => {
    // convert id in string to integer
    // const id = req.params.id * 1;

    // get the tour
    // const tour = tours.find(el => el.id === id);

    // send the response
    res.status(200).json({
        status: 'success'
        // data: {
        //     tour
        // }
    });
};

exports.createTour = (req, res) => {
    // to create new id
    // const newId = tours[tours.length - 1].id + 1;
    // use Object.assign to merge to objects to become one new object
    // const newTour = Object.assign({ id: newId }, req.body);
    // tours.push(newTour);
    // fs.writeFile(
    //     `${__dirname}/../dev-data/data/tours-sample.json`,
    //     JSON.stringify(tours),
    //     () => {
    //         res.status(201).json({
    //             status: 'success',
    //             data: {
    //                 tour: newTour
    //             }
    //         });
    //     }
    // );
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<updated tour here>'
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};
