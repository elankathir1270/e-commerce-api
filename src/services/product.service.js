const productRepository = require("./../repositories/product.repository");

const getProducts = async () => {
  return productRepository.getProducts();
};

module.exports = {
  getProducts,
};
