const express = require("express");
const productRouter = require('./routes/product.routes');
const reviewRouter = require('./routes/review.routes');
const inventoryRouter = require('./routes/inventory.routes');

const app = express();

//Body parser
app.use(express.json());

//add routes for app
app.use("/api/v1/products",productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("api/v1/inventory", inventoryRouter);


module.exports = app;