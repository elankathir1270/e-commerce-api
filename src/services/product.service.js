const productRepository = require("./../repositories/product.repository");

const getProducts = async (query) => {
  return productRepository.getProducts(query);
};

module.exports = {
  getProducts,
};
