const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: "./config.env"
});
const { startJobs } = require("./jobs/index");

const app = require('./app');

//db connection
const contString = process.env.CONNECTION_STRING
mongoose.connect(contString)
.then((conn) => console.log('Connection to db successful'))
.catch((err) => console.error('Could not connect to MongoDB', err))

//Initiate jobs
startJobs();

//create and listen web server
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log("Express Server is up and running..");
})