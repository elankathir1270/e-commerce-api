const express = require("express");
const productController = require("./../controllers/product.controller");
const { getProductsSchema } = require("./../validators/product.validator");
const validate = require("./../middlewares/validate.middleware");

const productRouter = express.Router();

productRouter
  .route("/")
  .get(validate(getProductsSchema), productController.getProducts);

productRouter
    .route("/:slug")
    .get(productController.getProductBySlug);

module.exports = productRouter;
