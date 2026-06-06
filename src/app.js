const express = require("express");
const productRouter = require('./routes/product.routes');

const app = express();


//add routes for app
app.use('/api/v1/products',productRouter);


module.exports = app;