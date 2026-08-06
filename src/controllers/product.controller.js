const productService = require("./../services/product.service");
const catchAsync = require("./../utils/catchAsync");
const sendResponse = require("./../utils/sendResponse.utils");

const getProducts = catchAsync(async (req, res) => {
  const products = await productService.getProducts(req.query);

  sendResponse(res, { statusCode: 200, data: products });
});

const getProductBySlug = catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);

  sendResponse(res, { statusCode: 200, data: product });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body
  );

  sendResponse(res, {statusCode: 200, data: product});
});

module.exports = {
  getProducts,
  getProductBySlug,
  updateProduct
};
