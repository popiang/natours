const fs = require('fs');
const express = require('express');

const app = express();

// this is a middleware
// to modify the incoming req data
// data from body is added into req object
app.use(express.json());

// get all the tours from file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-sample.json`));

app.get('/api/v1/tours', (req, res) => {
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours: tours
		}
	})
});

app.get('/api/v1/tours/:id', (req, res) => {

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
});

app.post('/api/v1/tours', (req, res) => {

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
});

app.patch('/api/v1/tours/:id', (req, res) => {

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
});

app.delete('/api/v1/tours/:id', (req, res) => {
    
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
});

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
