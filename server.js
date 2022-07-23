const dotenv = require('dotenv');

// to read the variables in the config file and save it in the node js environment variables
dotenv.config({ path: `./config.env` });

const app = require('./app');

// START THE SERVER
const port = process.env.PORT;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App is running on port ${port}`);
});
