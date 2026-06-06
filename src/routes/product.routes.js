const express = require("express");
const productController = require("./../controllers/product.controller");

const productRouter = express.Router();

productRouter.route("/").get(productController.getProducts);

module.exports = productRouter;
