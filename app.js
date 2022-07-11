const fs = require('fs');
const express = require('express');

const app = express();

// this is a middleware
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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours')
	.get(getAllTours)
	.post(createTour);

app.route('/api/v1/tours/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour);

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
