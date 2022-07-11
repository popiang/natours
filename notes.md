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
