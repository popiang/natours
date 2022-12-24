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

# 102 - Aggregation Pipeline: Matching and Grouping

- extremely powerfull and usefull mongodb framework for data aggregation
- define a pipeline that all the documents from a certain collections to go through where they are processed step by step in order to transform them into aggregated results
- example: everage, min, max, distance

- create getTourStats in tourController
  - standard async await function with req and res
  - use Tour.aggregate
  - inside Tour.aggregate([]), define the aggregate stages that we want
	- $match:
	  - ratingsAverage
	- $group:	   
	  - _id, numTours, numRatings, avgRating, avgPrice, minPrice, maxPrice
	- $sort:
	  - avgPrice
	- can find the stages in mongodb website
	- in each stage use mongodb operator to get the result:
		- $avg, $min, $max
  - return the result to a variable
  - return the variable in the response as usual

# 103 - Aggregation Pipeline: Unwinding and Projecting

- basically almost the same like above the whole setup
- unwinding by the startDate:
	- meaning creating a copy of the document for each date in the document
	- if in one document got 3 startDate, then 3 same documents will be created for each startDate
	- use $unwind
- projecting is controlling what value to display in the result:
	- if _id: 0, then it will not be displayed
	- use $project
- $addFields:
	- to add new key value in the result
	- $addFields: { month: '$_id' }

# 104 - Virtual Properties

- fields that can be defined in our schema but won't be persisted
- how to create:
	- tourSchema.virtual('durationWeeks').get(function() {
		return this.duration / 7;
	})
	- durationWeeks is the virtual properties
	- in the schema, set the option for toJSON and toObject as virtuals: true
- try run by postman and the virtual properties should be visible

# 105 - Document Middleware

- mongoose middleware
	- to make something happen between 2 events
	- also called pre or post hook
	- can define function before or after certain events
	- 4 types:
		- document
		- query
		- aggregate
		- module
	- document middleware:
		- can act on the currently processed document
		- define the function hook
		- define in the schema
		- example:
			- tourSchema.pre('save', function(){})
				- next function is available
				- to call the middleware in the stack
			- tourSchema.post('save', function(){})
				- have access to document that has just been saved to db
				- executed after all the pre middleware are executed
				- no the this, but have finished document 
		- can have multiple middleware
		- hook & middleware : same meaning 
* any data need to be in the schema to be persisted in db

# 106 - Query Middleware

- pre find hook - a mongoose middleware that will run before any find query is executed
- same with document middleware, the only difference is the find hook, that makes it a query middleware
- the this keyword now points at the current query, not the current document
- create a query middleware for both find and findOne hook in one function
  - use regular expression /^find/ so any hooke that starts with the word find will call this query middleware
- post middleware: 
  - have access to all of the documents return by the query
- create pre and post query middleware and test in postman

# 107 - Aggregation Middleware

- allow us to add hook before or after an aggregation happens
- if we have many aggregations and we want to filter something, instead of inserting the filter in all of the aggregation, it's more efficient to use aggregation middleware (pre), so this a sample use 
- the pattern is almost the same with other middleware except that it uses 'aggregate' hook
- the this in aggregation middleware points to the aggregation object
- add pre aggregate middleware to add filter to secretTour for all aggregates
  - this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  - what it's doing is to add additional stage to filter the result

# 108 - Data Validation: Built-In Validators

- do it in the model
- mongoose already comes with validation tools out of the box
- required : in the schema is actually a validator
- maxlength & minlength
  - for string length
  - can add the error message
  - eg: maxlength: [40, 'the error message']
- max & min
  - for length of numbers and date
  - can add the error message
  - eg: max: [5, 'the error message']
- enum
  - can create a set of values to choose from
  - can add the error message
  - eg: enum: {value: ['easy', 'medium'], message: 'the error message'}

  # 109 - Data Validation: Custom Validators

  - custom validators are simply functions that return true or false
  - use the keyword 'validate'
  - validate is assigned a function
  - the function received the value of the field as it's parameter
  - inside the function we can put the required logic and return either true or false
  - if want to add error message, use curley braces for the validate, inside have validator for the function and message for the error message
  - can use ({VALUE}) to display the value of the field in the error message
  - use custom validators to validate that priceDiscount is smaller then the price
  - this in the function only points to NEW document, meaning not working on update
  - there is also validator library, called 'validator', can be downloaded using npm, please check documentation for details

# 111 - Debugging Node.js with ndb

- run: sudo npm install ndb --save-dev
- create script in package.json
	- "debug": "ndb server.js"
- run the script:
	- sudo npm run debug
- we can use ndb to run debugger

# 112 - Handling Unhandled Routes

- in app js, the logic is, if a request flows past tourRouter and userRouter, it means there's something wrong with the request
- so the idea is, we put a middleware after tourRouter & userRouter, meaning we will catch this problematic request and then send proper error response
- use: app.all('*') ---> to catch all type of http methods and verbs
- in the middle simply response normally for bad request

# 114 - Implementing A Global Error Handling Middleware

- out of the box express already have a middleware to handle errors
- we create a global error handling middleware to handle all operational errors, meaning just one middleware to handle all of the errors
- we use: 
	- app.use((err, req, res, next) => {})
	- express automatically knows that this is a error handling middleware
	- inside err we have:
		- err.statusCode
			- set a default if not available
		- err.status
			- set a default if not available
		- err.message
			- receive from where the error is triggered
	- how to triggered?
		- where the error is triggered, call next(err)
		- when next() has an argument, express will automatically treats it as calling the global error handling middleware
		- in the err where the error is triggered we normally will set the status, statusCode & message

# 115 - Better Errors And Refactoring

- let's refactor the error handlers to make it better
- create an AppError class file in utils folder
	- extends Error
	- receive message and statusCode
	- send message to super
	- set the statusCode, status and isOperational
	- set Error.captureStackTrace
	- export the class
	- require the class in app.js
	- the next function to trigger the error hanlder, send the AppError class object as the arguments
	- create errorController file
	- move the global error handler function into the errorController file, then export it
	- require it in app.js, send the global error handler in the app.use()
	- test using postman

# 116 - Catching Errors in Async Functions

- this is a very difficult chapter
- basically, we want to consolidate all the error catching codes from all controller functions and put it in one place
- originally all functions in the controller are async function, thus it requires try catch block, thus making our code looks messy
- so we create a function, that will wrap the async functions, receiving the async function as parameters
	- const catchAsync = fn => {}
	- fn is the parameter of the function
	- so we do: catchAsync(*the async function*)
	- the async function is assigned to fn
	- then inside catchAsync function, we immediately call fn function:
		- like this =>> fn()
		- fn must have 3 parameters as well
		- fn(req, res, next)
		- fn is a async function, thus it returns a promise
		- but when a async function encounter errors, the promise will not be fullfilled and the error can be catched:
			- fn(req, res, next).catch(err => next(err))
- but we got 2 problems:
	- the function catchAsync and fn are immediately called, then the result is returned to exports.createTour, and this is not what we want, we want just to return the function, and it should only be invoked when there is a request received
	- the parameters req, res & next are not known
- solution:
	- catchAsync return an anonymous function that received req, res & next as parameters and in the anonymous function we called the fn function
- then all the functions in tourController files will be amended:
	- wrapped all the async functions in catchAsync function call
	- remove the try catch and error response code
- to make it even better, move the catchAsync function to catchAsync file in utils folder, export it, the require it in tourController file

# 117 - Adding 404 Not Found Errors

- for all functions in tourController that query for a tour by using the id, we will return a new Error with a proper message and with a 404 status in the next() function
- reason being is, if the id sent to the url is valid, but the tour is not exist, express will return success status but with 0 data
- so we add this piece of code to handle this situation
- the next function is return, to make sure the flow of the execution immediately return, doesn't go to the next line

# 118 - Errors During Development vs Production

- the idea is, we want to give different error messages in development and production environment
- in development we want to get as much info on the error as possible, but in production we want to give out minimum and appropriate error message to end users
- using process.env.NODE_ENV, we check if it's dev or prod, then send the appropriate response
- do this in the errorController.js
- create 2 function to send error response, for dev and prod
- using if else, call the respective error function based on the process.env.NODE_ENV value
- then in production environment, to distinguish between isOperational errors and other errors, check for isOperational field in the error object. Is is there and true, send errors to users as usual, but if it's not send generic error message to end user and send error message to console for developer's reference later on

# 119 - Handling Invalid Database IDs

- there are 3 types of error that are coming from mongoose, but we need to flag as isOperational so we can send meaning error messages back
- but this need only be done in production env as in development env we want all error messages be sent back
- first is invalid database id
	- the error stack contains name field with the value CastError
	- if the error stack contains this value, this is an invalid database id error from mongoose
	- use if condition to check it
	- use a function : handleCaseErrorDB(err)
	- in the function simply create a message using the err.path & err.value
	- return a new AppError()
	- now it becomes an isOperational error with a meaningfull error message to end users

# 120 - Handling Duplicate Database Fields

- capture the error message with a code 11000 using if statement
- call a function handleDuplicateFieldsDB(error)
- in the function get the err.KeyValue.name value and create a message
- return a new AppError with the message and a status code

# 121 - Handling Mongoose Validation Errors

- capture the error message with an error name ValidationError using if
- call a function handleValidationErrorDB(error)
- in the function:
	- the error messages are in errors sub object
	- get those messages into arrays using Object.values(err.errors).map(el => el.message)
	- create the message, append the error messages using join('. )
	- return a new AppError with the message and a status code

# 122 - Errors Outside Express - Unhandled Rejections

- this is errors coming from mongodb, such as incorrect database password
- handle it in the server.js file
- catch using event listener for 'unhandledRejection'
	- listen using process.on
	- console.log error message properly
	- close the server
	- exit the process

# 123 - Catching Uncaught Exceptions

- catch using event listener for 'uncaughtException'
	- listen using process.on
	- console.log error message properly
	- exit the process
	- put at the top of the page so it is listening to everything

# #####################################################

# 125 - Modelling Users

- we start by creating user schema
- create userModel.js
- require mongoose
- create userSchema with below fields:
	- name
	- email
	- password
	- confirmPassword
- then create User: const User = mongoose.model('User', userSchema)
- then export the User

# 126 - Creating New Users

- basically we will do all user related action like creating new users, authenticating users, logging users in, updating password and etc in the authentication controller
- not in user controller
- create authController.js
- require User
- create signup function that receive req, res, next and create user using User.create(req.body)
- don't forget the await
- send response as usual with the data of user
- wrap the whole function using catchAsync to handle exception

- in userRoutes, require authController
- create route with http method post for signup and assign the function signup from authController

- test create user using postman
- double check in mongodb

# 127 - Managing Passwords

- start with checking password === confirmPassword
- do it in userSchema, under confirmPassword
	- add validate
		- add validator function
		- add message
- test in postman

- then we hash the password
- do it in the userModel
- install bcryptjs package and require it
- use document pre middleware
	- use on save, to take action right before document is saved
	- check and proceed only if password is modified
	- hash the password using bcrypt and asign back to this.password
	- delete confirmPassword 
	- call next()
	- hash is async function, thus it return a promise, so the funtion must be async and the bcrypt is await
- test with postman

# 129 - Signing Up Users

- first, udpate the previous code to create user in authController.js
- then npm install jsonwebtoken and require it
- in config.env store the jwb data:
	- jwb_secret - should be 32 characters long
	- jwt_expires_in
- create token:
	- jwt.sign(data, secret, option(expiresIn))
	- use data from config for above
- send the token in the response to login the new user

# 130 - Logging In Users

* in user model, at password field, add attribute select: false, so password won't be reveled when we retrieve users data
* complete the getAllUsers in userController to test

- in authController create login function and export it
- receive email and password from the body
- check if no value then return new AppError
- then user findOne to query by email, then set explicit +password to get the password as well in the result
- in the userModel, we create an instance function correctPassword which receive user input password and password from db from above fineOne, use bcrypt.compare and compare both password and return true or false
- back to authController, check if the user input password is correct by using the correctPassword function
- check if user exist, then check if password correct, if either is false then return new AppError with message incorrect email or password
- if everything is ok then generate the token and send it in the response
- refactor the code a bit, create the generateToken at the top of the file and call it wherever neccessary

# 131 - Protecting Tour Routes - Part 1

- the best place to do route protection is in the tourRoutes file
- in getAllTours router, we call a middleware to check if user has right to access getAllTours
- the middleware is created in authController
	- create the middleware as usual, call it protect
- require it in the tourRoutes and call it before getAllTours in the router
- in the middleware:
	- token in send from client request through header
	- in header: key: Authorizaition, value: Bearer thetoken
	- in middleware the token can be retrieved from header : req.headers.authorization
	- so check:
		- the Authorization is there
		- it starts with 'Bearer'
	- if true, retrieve the token using split(' ')[1]
	- then check the token again, if not available, return next(new AppError('You are not logged in. Please login to get access', 401))

# 132 - Protecting Tour Routes - Part 2

- next is to verify the above token
- use jwt.verify(token, process.env.JWT_SECRET)
- require promisify from util
- use it to promisify jwt.verify and asign it to a variable decoded

- error handling:
	- handleJWTError : error when token is modified
	- in errorController, create handleJWTError function to simply create new AppError with a proper message and error status code
	- add code to handle error.name === JsonWebTokenError and call the above function
	* only works in production

	- handleTokenExpiredError : error when token expired
	- handle it the same way as above
	* only works in production

- next is to check if user still exist
- above decoded variable contains user id: decoded.id
- get user using User.findById
- if not exist
	- return next(new AppError(message, statuscode))

- check if user's password changed after token issued
	- add field passwordChangeAt in the user schema with the type Date
	- then create a static method in userModel
		- name changePasswordAftert
		- parameters JWTTimestamp
		- check if value changePasswordAt is exist, it if only exists if user has changed the password and that's when we need to concern
		- if not exist, simply return false
		- if exist, convert the time to seconds
		- then compare it with JWTTimestamp
		- JWTTimestamp < changePasswordAt
		- return the comparison result
		- if true, meaning user has changed the password after token is generated
	- call this static method in the authController in this 4th step
	- if true, return next(new AppError(**, **)) as usual

# 134 - Authorization - User Roles and Permissions

- firstly, we add role field in the user schema
	- user : {
		type: String,
		enum: ['admin', 'guide-lead', 'guide', 'user'],
		default: 'user'
	}
- clear the table and create new users, normal user and an admin
- at the moment, we focus on deleting tour
	- in tour route, before deleteTour middleware, we add protect middleware and restrictTo middleware
	- restrictTo middleware will restrict deletion feature only to certain roles
	- the middleware can receive multiple roles as parameters
	- now create the middleware in authController

- create the restrictTo middleware
- but since it needs to receive the roles parameters, we wrape the middleware in a function which receive the roles as arguments
- the received roles arguments are roles that are allowed to do the tour deletion
- so we need to compare with the role on current user
- that value can be found in : req.user.role
	- passed by the previous middleware - protect
- now all we need to check if the current user role is in the user roles array
- simply user !roles.includes(req.user.role) to check
- if not included, simply return new AppError('', 403)
- if included(allowed), simply execute next() to pass the flow to the next middleware

# 135 - Password Reset Functionality : Reset Token

- firstly create a forgotPassword middleware function in authController
- steps:
- 1. get user based on posted email
	- find the user by using the user email
	- if user not exist, simply return error as usual with 404 code
- 2. generate the random token
	- create additional fields in user schema:
		- passwordResetToken: String
		- passwordResetExpires: Date
	- create the function to generate the random token in userModel.js
	- require crypto
	- generate the token = crypto.randomBytes()
	- encrypt the generated token using crypto
	- assign the encrypted token to this.passwordResetToken field
	- assign expires time to this.passwordResetExpires
		- Date.now() * 10 * 60 * 1000 (10 minutes)
	- return the resetToken (not encrypted)
	* the not encrypted resetToken will be sent to user's email, the encrypted one will be save in database
	* when the user clicks the link to reset password in the email, the unencrypted resetToken will be compared with the encrypted one in the database

	- in the authController, we call the function that create the token to reset password
	- save the user data : user.save()

# 136 - Sending Emails with Nodemailer

- create account in mailtrap.io for email testing
- once completed, get the SMTP settings
	- username, password, host & port
- save all those settings in config.env

- npm install nodemailer
- create email.js in utils
- require nodemailer
- create async funtion which receive 'options' as a parameter
	- create transporter
		- nodemailer.createTransport({})
		- set the host, port and auth using values from config.env
	- define the email
		- create mail options block
		- set the from, to, subject and text
		- value for to, subject & text are from the options parameter
	- send the email
		- transporter.sendMail(mailOptions)
	- export the function

- in authController, in final part of forgotPassword middleware which is send the token to user's email
	- create the reset URL
		- resetURL = `${req.protocol}://${req.get(
        'host')}/api/v1/users/resetPassword/${resetToken}`
	- create the message which includes the resetURL
	- in a try catch block, send the email
	- await the sendEmail
	- in send email, set the options arguments block
		- email: user.email
		- subject: **
		- message: message
	- if ok, send appropriate response
	- if not ok, error will be catched catch block
		- reset user passwordResetToken & passwordResetExpires to undefined
		- save it *await
		- then return next(new AppError()) as usual with 500 status code

- finally test the middleware using postman with valid and invalid email addresses

# 137 - Password Reset Functionality - Setting New Password

- firstly, make sure in the userRoute.js, middleware for resetPassword, in the url there's the token parameter
- for resetPassword, there involved steps:
	- get user based on token
		- in this scenario, when have no information at all of the user except the token sent to the user, so using the token we will try to find the user in the database
		- firstly, using the not encrypted token, we encrypt it using crypto
		- then using the hashedToken, we use user.findOne to find the token
		- in the query, we also add filter to find user with passwordResetExpires still valid($gt: Date.now())
	- if token not expired and there's a user, set the new password
		- if user not exist, return next(new AppError()) with proper message and 400 status code
		- if ok, then set the user object the new password and confirmPassword, set passwordResetToken & passwordResetExpires to undefined
		- then save the user, user.save()
	- update the changedPasswordAt property for the user
		- this is being done by pre middleware in the model file
		- create pre middleware
		- check if it's a new user or the password is not modified, then simply run next()
			- !this.isModified('password') || this.isNew
		- if not of both above cases, then set the user passwordChangeAt to current date time
			- this.passwordChangeAt = Date.now() - 1000
			- we minus 1000 milliseconds because sometimes the value is saved to fast before the jwt token is generated
			- it's not 100% accurate but it's a small hack to make sure technically the token is always created after the password has been changed
	- log the user in, send JWT
		- log in the user by using the signToken(user._id)
		- return success reponse
- once everything is done, test using postman

# 138 - Updating The Current User - Password

- in userRoutes, create route for udpatePassword
- in the route, call authController.protect first to make sure only logged in user can update the password

- in authController, create updatePassword function, wrappped with catchAsync as usual
- steps:
	- get user from collection
	- if user not exist, return next(new AppError()) as usual
	- the compare currentPassword from client with password from table, if not the same return next(new AppError()) as usual
	- if ok, update the new password for the user
	- save(update) the user
	- validation in user schema will check if password equals confirmPassword
	- finally, log in the user and send proper response to client

* refactor the code, move the part to log in user into a function, createSendToken(user, statusCode, res)

# 139 - Updating The Current User - Data

- in userRoutes.js, create a route for update user data called /updateMe, call userController.updateMe, but before that call authController.protect to make sure only logged in user can do the user data udpate
- in userController, create updateMe function
- steps:
	- check if the body of the req data contains password or confirmPassword data, if it does, return an error mentioning that this route is not to update password, if want to update password go to route /updatePassword
	- then update the user document
	- however we cannot user user.save() because validation for required fields will take place
	- so we need to use findByIdAndUpdate()
	- pass the id, the data to update and options
	- options= new:true, runValidators:true
	- for the data, it should only contains name and email of the user, because we don't want to update anything else
	- to achieve that, we create a function that receive req.body, 'name', 'email' as the parameters, and in the function we loop trough the req.body object and if the current el is included in the allowed fields, insert into a new obj which will be returned
	- filteredBody = filterObj(req.body, 'name', 'email')
	- the filteredBody then is used in the findByIdAndUpdate
- try with postment

# 140 - Deleting the Current User

- the basic idea of deleting user is, we don't really delete the user data from the database, but we simply set the user to inactive
- first thing, add active field in the user schema and set the default value tu true
- then create the deleteMe function as usual
- use findByIdAndUpdate(req.user.id, {active:false})
- return proper response

- in userRoutes.js, set the route to delete, use delete http method, call the protect first, then call the deleteMe

- test using postmen

- because now user model has active fields, we want to make sure only active users are displayed whenever we query them
- so, we use query middleware
- in userModel.js, we create userSchema.pre(/^find/, function(next){})
- in the middleware, this.find({active:{$ne:false}})
- then next()

# 142 - Sending JWT Via Cookie

- in authController in createSendToken function where we create and send the token, we set the cookie
- res.cookie('jwt', token, {option})
- option: 
	- in config.env set JWT_COOKIE_EXPIRES_IN=90
	- expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
	- secure: true, will only be sent in encrypted connection
	- httpOnly: true, the cookie cannot be access or modified by browser in anyway
- it cannot be test in development because of the secure: true, we in dev we don't use https
- the way around it, we remove the secure: true field in the options
- the in if statement, we check in the env is production and then we set cookieOption.secure = true
- test using postman and look at the created cookie

# 143 - Implementing Rate Limiting

- this method is to limit the number of request received from the same IP in the short period of time
- in app.js, install express-rate-limit and require it
- create a limiter middleware:
	- rateLimit({options})
	- max, windowMs, message
- use it:
	- app.use('/api', limiter)

# 144 - Setting Security HTTP Headers

- npm install helmet
- require it in app.js
- simply call: app.use(helmet())
- helmet helps to secure Express apps by setting various HTTP headers

# 145 - Data Sanitazation

- npm install express-mongo-sanitize
- npm install xss-clean
- require both in app.js
- use it:
	- app.use(mongoSanitize())
		- sanitize against NoSQL query injection
	- app.use(xss())
		- sanitize agains melicious html/javascript code

# 146 - Preventing Parameter Pollution

- npm install hpp
- Express middleware to protect against HTTP Parameter Pollution attacks
- require it in app.js
- use it:
	- app.use(hpp())
- however, we don't want to filter all parameters
- the way around it is to whitelist 
- hpp({whitelist:['duration']})

# 150 - Modelling Locations (Geospatial Data)

- it is decided that location is embeded in tour model schema
- add startLocation, then location
- mongodb support geospatial data out of the box
- geospatial data basically data describe places on earth using longitude and latitude
- startLocation
	- mongodb uses GeoJSON to specify geospatial data
	- for this object to be recognized as GeoJSON, we need type and coordinate fields
	- each of this field will have it's own schema type option
	- type:
		- type: String
		- default: 'Point'
		- enum: ['Point'] (to make sure can only be 'Point')
	- coordinates: [Number]
		- the longitude & latitude
	- address: String
	- description: String
	- startLocation is not really a document itself
	- it's just an object describing certion location on earth
	- to really create new document and embed in another document, we need to create an array
- location
	- [{ same as above }]
	- add additional, day: Number

- we will import brand new data from dev-data, tours.json which have the startLocation and location data
- in import-dev.js file, change the name of file to import to tours.json
- then run the file:
	- first delete
		- node ./dev-data/data/import-dev-data.js --delete
	- then import
		- node ./dev-data/data/import-dev-data.js --import

# 151 - Modelling Tour Guides - Embedding

- this is a sample of embedding
- guides are embedded in tour data
- so when creating a tour, we also specify the guides id in an array
- then we create a document middleware to find the user based on the id during save, and then save the whole user object(embedded) in the tour data
- the middleware:
	- it receive this.guides (the id in an array)
	- use map, then use find by id, and it returns promises
	- use Promise.all to get the guides data and set it to this.guides (overwrite with actual user objects)
- test using postmen
- only work for creating tour

# 152 - ModellingTourGuides - Child Referencing

- the previous chapter was only to show how to do embedding
- but it's not really ideal, so we'll switch to referencing
- first, we comment out the previous middleware
- then we delete the created tour
- then we amend the schema
	- guides: [] -> to mark as embedded
		- {}
			- type: mongoose.Shcema.ObjectId
				- to indicate the type is an object id
			- ref: 'User'
				- to indicate the above id is User object id
				- no need to import at the top of the page for this
- test using postman
- guides will only contain the id

# 153 - Populating Tour Guides

- the idea is to get the whole document of guides when querying the tour, to make it looks like the guides data has always been there when the truth is only has the ids
- so easy
- for get tour by id, in the tour controller, in the getTourById, in the query, simply add:
	- .populate('guides'); at the end of the findById statement
- then test using postman

- simple hack to filter the output data for above
- instead of 'guides', put in option object {}
	- path: 'guides'
	- select: '-__v -passwordChangeAt'
		- to filter out both fields from the output

- populate in the controller only works for get tour by id
- it doesn't work for get all tours
- so the solution is, we put the populate statement into a query middleware, then all methods that want to find the tour will get the whole guides document populated
- in tour controller, we cut the populate statement
- in tourModel.js, we create a new query middleware
	- tourSchema.pre('/^find/', function(next){})
	- this.populate()
- test using postman for both get tour by id and get all tours

# 154 - Modelling Reviews - Parent Referencing

- in this chapter, we simply create a reviewSchema
- fields:
	- review
	- rating
	- createdAt
	- tour (ref to tour)
	- user (ref to user)
- add option to display virtual fields
- export as usual

# 155 - Creating And Getting Reviews

- create reviewController
	- create review
	- get all reviews
- create reviewRoutes
	- create route for create review
		- protect and filter users using authController
	- create route for get all reviews
- add route to app.js as middleware
- test create and get all the reviews using postman

# 156 - Populating Reviews

 - simply add query middleware in review schema
 - this.populate('tour').populate('user')

 # 157 - Virtual Populate - Tour and Reviews

- the issue is, if we query tour, how do we also get the reviews of the tour
- the solution is virtual populate
- think of it as a way of keeping the review id in the tour but without persisting it in the database
- how:
tourSchema.virtual('reviews', {
	ref: 'Review',			// the schema model we refer to
	foreignField: 'tour',	// the field in the ref model
	localField: '_id'		// the corresponding value in this model
});
- next, we add populate like before, to only in getTourById, because it would too much of data retreival if we use it as well in getAllTours.
- how, in tourController, in get tour by id, in the query, simply add .populate('reviews') at the end of the statements

- if we watch carefully, we can notice there are chains of query happens
	- tour -> reviews -> tour 
- this is not ideal, so we simply need to remove the populate for tour in reviews

# 158 - Implementing Simple Nested Routes

- to create reviews:
	- // POST /tour/tourid/reviews
	- tour id will come from the url and the user id comes from the logged in user

- to get reviews:
	- // GET /tour/tourid/reviews
	- tour id will come from the url and the user id comes from the logged in user

- to get specific reviews:
	- // GET /tour/tourid/reviews/reviewid
	- tour id and review id will come from the url and the user id comes from the logged in user

- since the route starts with tour, then the routes are created in tourRoutes.js
- require reviewController
- create the route
	- router.route('/:tourId/reviews').post()

- in review controller, in create review method, we amend:
	- if (!req.body.tour) req.body.tour = req.params.tourId
	- if (!req.body.user) req.body.user = req.user.id

- try using postman

# 159 - Nested Routes With Express

- the current issue is the implementation is a bit messy because we put the route to create reviews in tour router simply because the route starts with tour, and also the code is duplicated in review rotuer
- solution -> use express feature: merge param
- so first, remove the code in tour router
- the require reviewRouter in tourRoutes
- then : router.use('/:tourId/reviews', reviewRouter)
	- this is actually mounting the router
	- just like in app.js
- then in reviewRoutes:
	- express.Router({mergeParams: true})
	- why, by default each router only have access to parameters of their specific route
	- but mergeParams allow the route to get the parameters from the former route as well
- test using postman

# 160 - Adding A Nested GET Endpoint

- now we also want to add nested route for the getAllReviews
- if got tour id, only reviews for that particular tour will be retreived
- in getAllReviews method in reviewController, simply check if req.params.tourId is available, and it it is, populate it to a filter variable : { tour: req.params.tourId }
- then send this filter varialble in Review.find(filter)
- test using postman

# 161 - BuildingHandlerFactoryFunctions_Delete

- after a while, we can see that many lines of code are repeated for various Model
- so the idea here is to create a function factory
- as the name implies, it create function based on the passed model
- let's start with delete tour
- first, we create a file, handlerFactory.js, require catchAsync & AppError
- then simply copy the delete tour code from tourController into handlerFactory.js
- amend it
	- export a function with the name deleteOne, so it's general, can be used to delete tour, reviews etc
	- set the parameter to Model
	- set the body of the function with the copied code just now
	- change the Tour to Model
	- change the error message to make it general
- now in tourController.js, require handlerFactory
- comment out deleteTour function
- create a new one
- exports.deleteTour = factory.deleteOne(Tour);
- because of javascripts closure feature, the req.params.id will be available in the factory.deleteOne function
- test with postman
- do the same for reviews
- do the same for users

# 162 - Factory Functions - Update And Create

- we do same technique for udpate
- create updateOne in handlerFactory
- use it in tourController, userController and reviewController
- create createOne in handleFactory
- don't need to use in creating user because we already have signup
- use it in tourController and reviewController
- for review controller, originally we have extra step that is to check the tour and user id
- so we remove that particular codes into a seperate middleware (setTourUserIds) and call the middleware in the review routes right before create review middleware


# 163 - Factory Functions - Reading

- we want to do the same technique just as before
- but in getting data we also have populate
- so first we create getOne method in the factory
- but we have additional parameter - popOptions
- in the body, first we findbyid
- then we check, if popOptions is available, populate the above query by using the popOptions parameter
- the rest is basically the same
- apply it to get tour, get review and get user

- now we do getAll
- we will use the one in getAllTour because it's the most complete and perfect method with APIFeatures
- everything else is basically the same
- but in original get review, we have code to filter if it has tourId, so we simply going to add the code directly into the factory method (hack) because it pretty harmless
- apply it to getAllTours, getAllReviews, getAllUsers
- try with postman
- now get reviews also has the functionaly to features like filter and sort

# 164 - Adding a/me Endpoint

- the logged in user wants to get the document of his/her self
- getOne requires the id to be passed as the parameter
- but in getme, the id should come from the logged in user
- so we simply create additional middleware:
	- exports.getMe
	- req.params.id = req.user.id
	- then call next()
- in userRoutes.js, we simply create new get router for '/me', then first call the protect, then getMe, then getUser
- test using postman

# 165 - Adding Missing Authentication and Authorization

- in tour routes, for getAllTours, we want to make it public so any other website or application in the world can embed our Natour app
- so we remove the protect for getAllTour
- for create, patch & delete, we set protect and restrictTo('admin', 'lead-guide')
- for monthly-plan, set the protect and restrictTo('admin', 'lead-guide', 'guide')

- in user routes, signup, login, forgotPassword and resetPassword are public
- all others can only be access for logged in user
- so simply add router.use(authController.protect) after the first 4 public routes, and it will make sure all other routes can only be access by logged in user
- for the last 5 routes, they can only be accessed by admin, so we do the same technique, simply add router.use(authController.restrictTo('admin')) right before these 5 routes, so now only admin can access these 5 routes

- for reviews, all routes must be authenticated, so we used protect
- createReview only by 'user', so use restrictTo
- patch & delete can only be done by user & admin, so use restrictTo for both

# 166 - Importing Review and User Data

- let's now import the provided data of users and reviews into database
- but we need to tweak the import script a bit
	- copy, paste and edit JSON.parse code for users and reviews
	- require User and Review
		- for User, add option { validateBeforeSave: false } to turn off validation which will ask for confirm password
		- in user Model, comment out middleware to enqrypt the password because users data from the file contains passwords which are already encrypted
	- in import function, copy paste and edit Tour.create(tours) for User and Review
	- in delete function, copy paste and edit Tour.deleteMany() for User and Review
- run : node ./dev-data/data/import-dev-data.js --delete
- run : node ./dev-data/data/import-dev-data.js --import
- then check in mongodb
- then test using postman
- finally don't forget to remove the comment on the code that encrypt the password

# 167 - Improving Read Performance With Indexes

- we all know that indexes improve query performance
- how to add indexes in node:
	- in tourModel:
		- tourSchema.index({price: 1})
		- 1 = sort ascending
		- -1 = sort descending
		- this is called single field index
		- if there are more then one indexes required in the query, we can create compound field indexes
		- tourSchema.index({price: 1, ratingsAverage: -1})
- if we ever want to remove an index, we not only need to remove it in the code, but we must also remove it in the database itself

# 168 - Calculating Average Rating On Tours - Part 1

- average rating is defined or redefined everytime there's a new review, edit review or delete review
- so to implement this, we'll use a static method
- reviewSchema.statics.calcAverageRatings = async function(tourid) {}
	- in the body we use aggregation
		- $match: { tourL: tourId }
		- $group: 
			- _id: '$tour'
			- nRating: { $sum: 1 }
			- avgRating: { $avg: '$rating' }
- we call this function in the post middleware, once the review data is saved, then this function will be called
	- reviewSchema.post('save', function(){})
		- this.constructor.calcAverageRatins(this.tour)
- test using postman, create new tour, then create review, console.log the stats

- now we want to update the particular tour with the ratingsAverage & ratingsQuantity value
- require Tour model
- after the aggregation pipeline part, simply call:
	- Tour.findByIdAndUpdate(tourId, {})
	- the body:
		- ratingsQuantity: stats[0].nRating
		- ratingsAverage: stats[0].avgRating
		- stats[0] because result from the aggregation is in array format
- test again with postman and check in mongodb the changes

# 169 - Calculating Average Rating On Tours - Part 2

- now we want to update the review
- the review for the tour is updated when a review is updated or deleted
- we need to use query middleware
	- reviewSchema.pre(/^findOneAnd/, async function(next){})
	- this will cover both update and delete for a review
- in the middleware we need to find the current review document
	- we simply can use: this.r = await this.findOne();
	- r means review
	- this.r, so the result will be available in the document and can be used in the next middleware
	- try first with postman and console.log the result to double check if it works
- now to recalculate the average rating, it cannot be done within the same middleware because it's a pre middleware, the data is fresh from the database, so it's not updated
- but it doesn't matter because we only needs the tour id in the review document
- so we create a post middleware, also using /^findOneAnd/, which will execute after the pre middleware, use the this.r data to get the tour id
- call the calcAverageRatings functions, send the this.r.tour as argument
- but calcAverageRatings function needs this.constructor, so the equivalent of it is: this.r.constructor.calAverageRatings
- it returns a promise, so must await async
- test it baby!!!
- also test for delete!!

- the calcAverageRatings method needs a little amendment
- if the last review is delete, the stats will return an empty array
- so we need to check:
	- if (stats.length > 0)
		- proceed with the code
	- else
		- populate quantity = 0, and average = 4.5

# 170 - Preventing Duplicate Reviews

- the idea is, one user can only post 1 review on a particular tour
- to achieve this, all we need to use is compound index with options:
	- reviewSchema.index({ tour: 1, user: 1 }, { unique: true })
- that's all
- test it using postman

- a little improvement, the ratingsAverage can become 4.666666
- so we can round it in the tourModel
- in the ratingsAverage field add this:
	- set: val => Math.round(val * 10) / 10

# 171 - Geospatial Queries - Finding Tours Within Radius

- the idea is to find all tours within certain distance from a center point
- firstly, we create a route
	- router.route('/tours-within/:distance/center/:latlng/unit/:unit')
	- get(tourController.getToursWithin)
	- got 3 parameters:
		- distance
		- latlng
		- unit
- then in tourController, create the above controller
	- get all 3 parameters from req.params, use block destructure
	- then get the lat and lat into their own variables
	- then check if lat or lng are available, if either one not, return new AppError
	- if everything ok, set the response
	- console.log to test
- next, in the controller we query for the tours
	- Tour.find({})
	- startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius]}}
	- the startLocation must be indexed:
		- tourSchema.index({startLocation: '2dsphere})
	- display the tours in the response

# 172 - GeospatialAggregation_CalculatingDistances

- the idea is to calculate the distance of the tours from the point provided in the router
- first we create the route
	- router.route('/distances/:latlng/unit/:unit)
	- .get(tourController.getDistances)
- now we create the controller in tourController
	- exports.getDistances = catchAsync(async(req, res, next) => {})
	- get the latlng & unit from req.params
	- get the individuals lat & lng from latlng
	- set the multiplier: 
		- const multiplier = unit === 'mi' ? xxxxx ? xxxx;
	- check if lat & lng exist, if not next(new AppError())
	- we use aggregate
		- const distances = await Tour.aggregate([])
		- the first and only stage, $geoNear
			- near
				- type: 'Point'
				- coordiantes: [lng * 1, lat * 1]
					- * 1 to convert to integer
			- distanceField: 'distance'
			- distanceMultiplier: multiplier
		- $project
			- to only display distance & name
			- distance: 1
			- name: 1
- return the response properly
- test using postman
			
# ##############################################################

# 176 - Setting Up Pub In Express

- install pug but don't need to require it
- create model folder
- create base.pug file
- in the file
	- h1 The Park Camper
	- same as: <h1>The Park Camper</h1>

- in app.js
	- require path
	- app.set('view engine', 'pug')
	- app.set('views', path.join(__dirname, 'views'))
	- router
		- put along with other router in the app.js
		- app.get('/', (req, res) => {res.status(200).render('base')})

# 177 - First Steps With Pug

- doctype html at the top just like regular html file
- then html
- then then content of the html must he indented:
	- html
		head
			title
- indentation is important to indicate an element is a child of a parent
- add css
	- link(rel='stylesheet' href='css/style.css')
- add favicon
	- link(rel='shortcut icon' type='image/png' href='img/favicon.png')
- the css file can be fetch because the files in the public folder have been set as static files using middleware in app.js
- send variables to pug:
	- res.status(200).render('base',{tour: 'The Foreset Hiker'})
	- in pug
		- h1= tour
		- this will display the content of tour variable as content of the h1 element
		- this is called buffered code
- in pug we can also write simple javascript code
	- h1= tour.toUpperCase()
- we also can write unbuffered code, which will not be displayed
	- - const x = 5	-> unbuffered code
	- h2= 2 * x		-> buffered code
- we can also output variable value using #{tour}
	- title Natours | #{tour}
- comment
	- // this will comment the code and still be displayed in the html page as commented html
	- //- this will comment the code and will not be displayed in the html page

# 178 - Creating Our Base Template

- simply take all the content in overview.html and put it in the base.pug file
- modify it accordingly
- this will become the base file

# 179 - Including Files Into Pub Templates

- in views folder, create _header.pug & _footer.pug files
- in base.pug, cut the header & footer codes and paste in accordingly in _header.pug & _footer.pug files
- then in base.pug inlcude _header & include _footer in replace for the codes that we have cut out
- make sure the indentations are all correct

# 180 - Extending Our Base Template With Blocks

- now we are going to extend the base template for overview and tour page
- overview page will display all the tours and tour page will display the details of the tour
- create overview.pug and tour.pug files in views folder
- in app.js we create the route
	- app.get('/overview', (req, res) => {})
		- render the 'overview' page with the title
	- app.get('/tour/, (req, res) => {})
		- render the 'tour' page with the title
- in base.pug
	- the content part, simply put 
		- block content
			h1 This is a placeholder heading
		- it means, this part will be replace by content supplied by other pug files that extends base.pug
	- in title part: title Natours | #{title}
		- the title will change according to the value supplied in the title local variable from the router
- in overview.pug
	- extends base
		- this will take all the base template code from base.pug into overview.pug except the content part
	- then put this code
		- block content
			h1 This is the tour overview
		- this define the a block called content 
		- we can put anything in here, but simply indent the content to make it belongs to this block
- in tour.pug
	- simply do the same as above

# 181 - Setting Up The Project Structure

- create viewRoutes.js and viewController.js files
- delete the base router in app.js as it's only for testing
- move overview and tour routers from app.js into viewRoutes and then fix the code accordingly
- move the function in overview and tour routers into viewController file
- in viewController file, export both functions as getOverview and getTour
- require viewController into viewRoutes file
- place the viewController.getOverview and viewController.getTour accordingly into the routes
- for overview router, set the url to '/', so when user go to the base url, it will display the overview page to display all the tours
- in app.js, require viewRoutes
- put app.use('/', viewRouter) as a replace for the removed codes
- done and done

# 181 - Building The Tour Overview - Part 1

- steps
	- get tour from collection
	- build the template
	- render the template using tour data from step 1

- get tour from collection
	- in viewController 
		- require Tour and catchAsync
		- in getOverview method
			- update the method with catchAsync, async, next
			- then, const tours = await Tour.find
			- put the result in the response
				- tours: tours

- in overview.pug
	- translate the main part in the overview.html to pug
	- only for 1 card
	- then check if it's ok
	- then after .card-container add 
		- each tour in tours
		- this tours is a variables
		- it will create a loop for it's content

# 183 - Building The Tour Overview - Part 2

- simply output the value from the variable tour accordingly throughout the whole card component
- for img: img/tours/${}
- for date
	- the first in array
	- format the output
		- .toLocaleString('en-us', {month: 'long', year: 'numeric'})
- to add space between to inline element, add '| ' (there's a space after the pipeline)

# 184 - Building The Tour Page - Part 1

- first, we create the router in viewRoutes.js, with :slug as the parameter
- then in viewController, in the getTour method:
	- Tour.findOne({slug: req.params.slug})
	- .populate({path: 'reviews', fields: 'review rating user'})
	- send the result of the findOne in the response to be used in the pug file
- in tour.pug
	- simply change the dummy data with real data from tour variables
	- use mixin for repetitive code
	- format the date output

# 185 - Building The Tour Page - Part 2

- simply continue replacing the dummy data with real data from tour variables
- use javascript if where necessary
- use mixin for where necessary
- mixin put in different file

# 186 - Including A Map With Mapbox - Part 1

- fix bug in getTour handler in viewsController, pass the tour name in the title field when render the response

- create js folder in public folder
- create mapbox.js
- simply console out something in there

- now integrate the file with the tour.pug
- but if we put it just like that in the base.pug, the javascript file will be loaded for every file that extends base.pug
- the solution, in base.pug, we extends a block in base template file
- the block is in the head, and all the content of the head will be in the block
- but we will not extrend the head block because that will replace all the head content in the base template file
- instead, in tour.pug, we use:
	- block append head
	- what happens is, the tour.pug already extends base template file, and the above script simply add additional code at the end of the head part in the base template file, hence it is called append head
	- there's also prepend which will add the code at the beginning
 
 - now we need to send the data of maps to the javascript file
 - in tour.pug file, in the map section, we already have a div with an ID map
 - so we set the location data in the div using data attributes
	- we name the data attribute data-locations
	- #map(data-locations=`${JSON.stringify(tour.locations)}`)
	- the data attribute cannot hold data in array or object type, so we convert it to string using JSON.stringify
	- check the data in browser inspect

- now let's get the data in mapbox.js
- document.getElementById('map').dataset.locations
- assign it to a constant variable
- but before assigning, cover it back to object/array
	- JSON.parse

- it seems the javascript is loaded before the 	DOM fully rendered
- so use defer

# 187 - Including A Map With Mapbox - Part 2

- go to mapbox.com and register an account, create a token and create a map style
- then click Integrate Mapbox and choose web
- copy the script, link to the tour.pug head, then click next
- copy the js code and paste it into mapbox.js
	- copy paste the token we created
	- copy paste the style we created
	- add:
		- scrollZoom: false
		- so user won't accidently zoom the map in or out when scrolling the page
- we tested, there'll be a bug, which the solution is provided by a user manuel, apply his solution and then try checking the map

- then we need to set the bounds
- the idea is, the map zoom in to the extend which it will still display all the locations in the map
- all the locations must be set to the bounds
- first, create bound object:
	- const bounds = new mapboxjs.LngLatBounds();
	- next we need to bound object to extends all the locations
	- we do this in the loop
- we iterate the locations
- each iteration
	- create a html element div with class name marker
	- then we add marker
		- new mapboxgl.Marker({})
		- element: el (the div element created above)
		- achor: bottom (the location is at the bottom of the marker)
		- .setLngLat(loc.coordinates)
		- .addTo(map)
	- then we add popup
		- new mapboxgl.Popup({})
		- offset: 30 (not sure what this does???!!!)
		- .setLngLat(loc.coordinates)
		- .setHTML(`<p>${loc.day}: ${loc.description}</p>`)
		- .addTo(map)
	- bounds.extend(loc.coordinates)

- finally:
	- map.fitBounds(bounds, {})
	- padding: {}
		- top: 200
		- bottom: 150
		- left: 100
		- right: 100


