const productService = require("./../services/product.service");
const sendResponse = require("./../utils/sendResponse.utils");

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts(req.query);

    sendResponse(res, { statusCode: 200, data: products });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);

    sendResponse(res, { statusCode: 200, data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
};
