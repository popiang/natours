const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARE

// HTTP request logger middleware for node.js
app.use(morgan('dev'));

// to modify the incoming req data
// data from body is added into req object
app.use(express.json());

// custom middleware
app.use((req, res, next) => {
	console.log('Hello from the middleware 💥');
	next();
});

app.use((req, res, next) => {
	req.requesTime = new Date().toISOString();
	next();
});

// 2) ROUTE HANDLERS

// get all the tours from file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-sample.json`));

const getAllTours = (req, res) => {
	console.log(req.requesTime);
    res.status(200).json({
        status: 'success',
		requestedAt: req.requesTime,
        results: tours.length,
        data: {
            tours: tours,
        },
    });
};

const getTour = (req, res) => {

	// convert id in string to integer
	const id = req.params.id * 1;

	// get the tour
	const tour = tours.find((el) => el.id === id);

	// check if tour exist
	if (!tour) {
		return res.status(400).json({
			status: 'fail',
			message: 'Invalid ID'
		});
	}

	// send the response
    res.status(200).json({
        status: 'success',
		data: {
			tour
		}
    });
};

const createTour = (req, res) => {

	// to create new id
	const newId = tours[tours.length - 1].id + 1;

	// use Object.assign to merge to objects to become one new object
	const newTour = Object.assign({id: newId}, req.body);

	tours.push(newTour);
	fs.writeFile(`${__dirname}/dev-data/data/tours-sample.json`, JSON.stringify(tours), err => {
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		})
	});
}

const updateTour = (req, res) => {

	// convert id in string to integer
    const id = req.params.id * 1;

    // get the tour
    const tour = tours.find((el) => el.id === id);

    // check if tour exist
    if (!tour) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<updated tour here>',
        },
    });
};

const deleteTour = (req, res) => {
    
	// convert id in string to integer
    const id = req.params.id * 1;

    // get the tour
    const tour = tours.find((el) => el.id === id);

    // check if tour exist
    if (!tour) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

	res.status(204).json({
		status: 'success',
		data: null
	})
};

const getAllUsers = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined'
	});
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

// 3) ROUTES

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/')
.get(getAllTours)
.post(createTour);

tourRouter.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

userRouter.route('/')
.get(getAllUsers)
.post(createUser);	

userRouter.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);

// mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START THE SERVER

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
