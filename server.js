const dotenv = require('dotenv');

// to read the variables in the config file and save it in the node js environment variables
dotenv.config({path: './config.env'});

const app = require('./app');

// to see the environment we are currently in
console.log(app.get('env'));
console.log(process.env);

// START THE SERVER
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
