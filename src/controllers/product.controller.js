const productService = require("./../services/product.service");

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProducts
};
