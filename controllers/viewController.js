const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1. get tour data from collection
    const tours = await Tour.find();

    // 2. build the template

    // 3. render the template using tour data from step 1

    res.status(200).render('overview', {
        title: 'All Tours',
        tours: tours
    });
});

exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
};
