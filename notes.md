# 50 - Setting up Express and Basic Routing

1. create package.json files
- npm init

2. install express
- npm installl express@4 (to install version 4.0)

3. create app.js file
- it's a convention to have all of express configurations in app.js file

4. require express, create app, then run app.listen, then create a basic route

5. test using postman

6. then try send back response in json format

7. test route using post

# 52 - Starting Our API: Handling GET Request

1. get the tours data from the file using fs, then use **JSON to parse it** and put it in a variable
- top level code is only executed once, so put the code to fetch the data above the route

2. create a route for the api and return the tours in json format
- return status, results count & the datad

3. test using postman

# 53 - Handling POST Request

- data is sent to server from client to req var
- out of the box, express doesn't put that body data in req var, we have to use middleware

1. add middleware before the route to add the data from the data body to req object
- app.use(express.json())

2. create a route for post request to send data to server
- create new id
- create new tour object
- push new tour to tours array
- write to file using writeFile because it is executed in a callback, so we don't want to block other code execution
- use JSON.stringify to change javascript object to json format
- send response to client with 201(created) status

# 54 - Responding to URL Parameters

1. create a route with an id parameter in the url:
- '/api/v1/tours/:id'

2. the parameters are available in req.params object

3. can add multiple params:
- '/api/v1/tours/:id/:x/:y'
- but now it will make it compulsory to send the parameters
- we can make it optional:
	- '/api/v1/tours/:id/:x/:y?'
	- parameter y is now optional

4. req.params values are in string format, so need to convert it proper format before using it

5. get the id from req.params, then get the tour from tours array and then return in in response

6. add checking for invalid id and send proper response

# 55 - Handling Patch Requests

- will use http method patch instead of put

1. create the route with the http method patch, return proper response, put some checking

2. the rest of the process is not implemented until we have come to mongodb

# 56 - Handling Delete Requests

1. create the route with the http method delete, put some checking and return proper response with status code 204

2. the rest of the process is not implemented until we have come to mongodb

# 57 - Refactoring Routings

1. export handler functions into their own functions

2. call the handler functions in the respective routes
- app.get('/api/v1/tours', getAllTours)

3. make it even better by using app.route 
- app.route('/api/v1/tours').get(getAllTours)

# 59 - Creating Our Own Middleware

1. create middleware using app.use(), add the third parameter next

2. call the next() function once done to pass the flow to the next process

3. the order of middlewares are very important

4. global middlewares are normally defined before the routings

5. create a second custom middleware and add requestTime entry into the req object : req.requestTime = new Date().toISOString();, and put the entry into response object to check

# 60 - Using 3rd Party Middleware

1. npm install morgan

2. require morgan

3. add morgan as middleware:
- app.use(morgan('dev'))

# 61 - Implementing The Users Routes

1. create the route for users for all related http methods

2. create all the route handlers

# 62 - Creating And Mouting Multiple Routers

1. create routers for tours & users using express.Router()

2. mount the routers as middleware with the root api url

3. update the router urls accordingly

# 63 - A Better File Structure

- we create different routers for each resource (tour & user) so that we can have a nice seperation of concern between these resource
- app.js is mainly used for middleware declaration
- tourRouter & userRouter are considered middleware to handle api calls based on the urls
- it's a good practice to have everything related to server in server.js file and everything related to express in app.js file
- server.js will be our starting file

1. create routes folder and in there create tourRoutes.js file and userRoutes.js file

2. move tour routers and handlers into tourRoutes.js file and export the router

3. move user routers and handlers into userRoutes.js file and export the router

4. import the router for tour and user in app.js file

5. then create a controller foler and in there create tourController.js file and userController.js file

6. move all handlers function from tourRoutes.js & userRoutes.js into tourController.js & userController.js

7. export all the handler functions

8. import the controllers into the routes files

9. create server.js file and move code to run the app into it

10. export app from app.js file and import into server.js

# 64 - Param Middleware

- param middleware is a middleware that only runs for certain parameters in our URL
- it has fourth parameter = val, the value of the param
- to test, create one param middleware in tourRoutes.js file, specify the fourth parameter, console.log out the val see the param value and don't forget to and next() function at the end
- it can be used to validate the tour id:
1. in tour controller, create checkID function to check ID
2. the function is param middleware function, so it has the fourth param which is the id
3. in the function do the checking:
	a. return error response if tour id is not exist
	b. call the next function if tour id exist
4. remove the id checking in all other functions in the tour controller
5. call this checkID function in tourRoutes file in the param.middleware


# 65 - Chaining Multiple Middleware Functions

- middleware functions can be chained in the router
- simply create a new middleware function in the controller, export it, and call it before or after any middleware function in the router
* remember, a middleware function must have the next parameter!!!

1. create a checkBody middleware function in tour controller to check for compulsory data, name & price, in the req body
2. do the checking in the function:
- return 400 status with error message if name & price are not available in the req.body
- call next function in both required data are available
3. export this middleware function
4. call it in the tourRoutes page, in the tour router before the function to create the tour

# 66 - Serving Static Files

- static files are basically files in the system that can't be access through router
- eg: files in the public folder
	- no routers are associated with the files in this folder
- solution: built-in express middleware
	- app.use(express.static(`${__dirname}/public`));
	- call this middleware in app.js

# 67 - Environment Variables

- we set the environment variables outside of app.js(in appjs only related to express)
- in server.js, add console.log(app.get('env')) to see the environment we are currently in
- env variables are global variables that are used to define the variables in which the node app is running
- env variables is set by express, but node.js also set a lot of env variables
- to start environment in development:
	- in terminal: NODE_ENV=development nodemon server.js
	- other information can also be set in the server starting up command:
		- NODE_ENV=development X=23 nodemon server.js
- but the good practice is to set all the relevant information during server start up in the config.env file
- create it in the root folder and set the relevant information in it
- to make express can read the config file, we use npm package dotenv
	- install it and require it in the server.js file
- when we start the server, the config.env file will be read and the variables in the file will be stored in node.js environment variables
- once the variables are in node.js environment, it can be used set only to run certain middleware depanding on the variables value:
	- logging is to run only on development environment
	- so in the app.js file, only execute the logging middleware when process.env.NODE_ENV === 'development'
	- the port number is now also set using process.env variables

# 68 - Prettier & ESLint

- Prettier is code formatter
- ESLint is to check coding syntax
- install both in VSCode extension
- then install this in the terminal:
	npm i eslint@5.16.0 prettier@1.17.0 eslint-config-prettier@4.1.0 eslint-plugin-prettier@3.0.1 eslint-config-airbnb@17.1.0 eslint-plugin-node@8.0.1 eslint-plugin-import@2.17.2 eslint-plugin-jsx-a11y@6.2.1 eslint-plugin-react@7.12.4 --save-dev

//////////////////////////////////////////////////////////////////////////

# 83 - Connecting Our DB With The Express App

- create a database and collection in mongodb atlas
- create user and password
- in the config.env put the database connection string and database password
- install npm package mongoose and require it in server.js
- get the db connection string from env and replace the password in the string
- call mongoose.connect and put in the connectin string as arguments, along with some default option values
- above function call return a promise, handle it and console log the connection properties to verify the connection


# 85 - Creating A Simple Tour Model 

- mongoose is all about model
- model is like a class in javascript, like a blueprint to create document, and also to query, update & delete document
- to create a model, we need a schema
- schema is describe our data, to set default value, to validate, etc..

1. create schema in server.js using mongoose.Schema()
2. set the name of the field & datatype
3. we can also set schema type options to set more options for the field like required, default value & unique
4. once the schema is complete, create the Tour model using this schema using mongoose.model()

# 86 - Creating Documents And Testing The Model

- create a new tour using the above Tour model, set te name, rating & price
- run save() on the new tour object, and handle the returned promise, and also handle any possible error through catch
- execute server.js to save the document in the mongodb

# 88 - Refactoring For MVC

- create models folder
- create tourModel.js file
- move tour schema declaration and tour model declaration into tourModel.js file
- export the tour model
- in tour controller, remove everything that related to tour data retreived from the file

# 89 - Another Way Of Creating Documents

- use Tour.create({})
- handle the return promise using async await
	- if eslint produce error message on the node version, simply update package.json file on the node version
- send response as usual for successful document creation
- handle error by using try catch block for the whole code for async await
- don't forget the Tour.create(req.body)
- test using postman

# 90 - Reading Documents

* getAlltours
- use Tour.find() to get all the tours 
- it returns a promise, so use async await
- set the response as usual
- set try catch block and set the standard response for error
- test using postman to get all tours

* getTour
- use Tour.findById(req.params.id)
- everything else is the same with above
- test with postman, send along the id


# 91 - Updating Documents

* updateTour
- use Tour.findByIdAndUpdate()
- parameter, the id, the updated body and some options
	- new: true = return the updated tour
	- runValidators: true = validate the input
- it returns a promise, so use async await
- set the response as usual
- set try catch block and set the standard response for error
- test using postman for correct data
- test using postman for incorrect data to test the runValidators option

# 92 - Deleting Documents

* deleteTour
- use Tour.findByIdAndDelete()
- parameter req.params.id
- use async await
- use try catch
- handle error accordingly
- test with postman

# 93 - Modelling The Tours

- complete the tour model with all the attributes will all the type and other information
- use jonas completed project as reference of all the attributes
- once done, try adding a tour using data from the tours-sample.json file using postman

# 94 - Importing Development Data

- create a seperate script, inside data folder, to just import the data from the file into the database table
- require all the required components
- set the config file path
- set the database string
- create to database using mongoose
- read the tours from the file using fs and parse it into tours variable
- create importData function:
	- use async await, try catch
	- use Tour.create(tours)
	- process.exit() once done
- create deleteData function:
	- use async await, try catch
	- use Tour.deleteMany()
	- process.exit() once done
- use process argument variables to execute the script using command line:
	- add --delete or --import at the end of the node execution command
	- get the added argument variable, process.argv[2]
	- based on it execute either deleteData or importData function
- verify using postman

# 95 - Making the API Better - Filtering

* req.query
- during getAllTours, the API call can include extra parameters in the URL which can be used to query the result 
- the extra parameters can be fetch from req.query
	- eg: {duration: '5', difficulty: 'easy'}
- the query object can be used directly in the Tour.find() because the format happens to be compatible
- test using postman

* exclude special query params
- the url of the API call can also include parameters such as page, limit, sort, etc which are not used in tour query, but instead used to managed the result of the query
- so these parameters must be excluded from the query
	- make hard copy of the req.query
	- prepare the arrays of the possible parameters to exclude
	- use forEach on the array to loop, and delete the element in the hard copy of req.query
	- send the hard copy of the req.query to the Tour.find()
- test using postman

* final part
- when the query is executed in the await part, at that moment it's already to late to apply limit, pagination, sort, etc to the result
- therefore, the await is pushed a bit further down to execute the final query:
	const query = Tour.find(queryObj);
	const tours = await query;
- put comments to indicate all the involved processes

# 96 - Making the API Better - Advanced Filtering

- parameter in the query can also use comparison operator:
	- gt, gte, lt, lte
- how: 
	- eg: duration[gte]=5
- how reg.query reads it:
	- { duration: { gte: '5' }, difficulty: 'easy' }
- but mongoose needs the comparison to be:
	- { duration: { $gte: '5' }, difficulty: 'easy' }
- so simply use javascript to append the $ to the comparison operator
	- refer sample
- once amended the query string, then send it to the Tour.find()
- test using postman

# 97 - Making the API Better - Sorting

- use the sort parameter from the request(req) object to get the field to sort the result of the query
- check if the sort parameter is available
- then do query.sort(req.query.sort)
- assign the result back to query
- then send the query to Tour.find()
- the result will be sort ascending
- to make the ressult sorting descending, simply add - before the sort parameter value (eg: -price)

- if the first sort has a tie, in the API url simply add the second parameter for sorting, just seperate it with a comma(,)
- in the code, simply split the sorting parameters with comma, the join them back using space (' ')
	- it is because that is how sort values are called in mongoose
	- eg: sort('price ratingsAverage')
- if the second sorting also needs to be descending, simply add minus(-) just like the first sort parameters

- lastly, add else for the above if block, if no sort parameters are passed, simply sort using createdAt value

# 98 - Making the API Better - Limiting Fields

- use the fields parameter from the request object
	- req.query.fields
- split it by comma, then join them back by ' ' and assign it to fields variable
- then use the fields in the query.select()
- set the else for default limiting fields if user doesn't supply any
	- query.select('-__v'), to exclude the version no from the results

- fields can also be excluded directly in the schema
	- tourModel.js
		- search for the field and put 'select: false'
	
# 99 - Making the API Better - Pagination

- get the page and limit parameters from request object
- if no page, set the default:
	const page = req.query.page * 1 || 1
- if no limit, set the default:
	const limit = req.query.limit * 1 || 1
- times 1 to change the format from text to integer
- get the skip through below formula:
	const skip = (page - 1) * limit
- send it to the query:
	query = query.skip(skip).limit(limit)
- easy peasy!!!

# 100 - Making the API Better - Aliasing

- if we want to create an API that return results according to certain fixed query, meaning with certain limit, certain sort, certain fields, etc.., we can use a technic called aliasing
- first create a middleware in the controller with all the query and then exports it, don't forget to call the next function
- use the middleware in the route file
	- create a new router
	- give it a specific name, eg '/top-5-cheap'
	- the call the alias middleware first and then call the getAllTours
- test in postman, call the api using the router name: 'api/v1/tours/top-5-cheap'

# 101 - Refactoring API features

- create new object of API features class
- the object receive query object and query string that's coming from express
-  in each method, we manipulate the query, keep adding staff to the query
- each method will return this(the object it self) so we can do method chaining
- the object is assigned to variable features
- all the methods are called during the assignment
- in the end we await the result
- the result in assign to variable tours