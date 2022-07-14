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