const Product = require("./../models/product.model");
const InventoryTransaction = require("./../models/inventoryTransaction.model");

//get product
const getProduct = (productId) => {
  return Product.findById(productId);
};

//update product stock
const updateProductInventory = (productId, payload) => {
  return Product.findByIdAndUpdate(productId, payload, {
    new: true,
  });
};

//create transaction
const createTransaction = (payload) => {
  return InventoryTransaction.create(payload);
};

module.exports = {
    getProduct,updateProductInventory,createTransaction
}
