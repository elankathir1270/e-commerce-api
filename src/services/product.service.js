const productRepository = require("./../repositories/product.repository");
const ApiError = require("./../utils/apiError");

const getProducts = async (query) => {
  return productRepository.getProducts(query);
};

const getProductBySlug = async (slug) => {
  const product = await productRepository.getProductBySlug(slug);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

module.exports = {
  getProducts,
  getProductBySlug,
};
