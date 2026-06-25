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

//Atomic Stock Decrease
const decreaseStockAtomic = (productId, quantity) => {
  return Product.findByIdAndUpdate(
    {
      _id: productId,
      isAvailable: true,
      availableQuantity: {
        $gte: quantity,
      },
    },
    {
      $inc: {
        //Decrease fields by quantity
        quantity: -quantity,
        availableQuantity: -quantity,
      },
    },
    {
      new: true,
    },
  );
};

//Atomic Stock Increase
const increaseStockAtomic = (productId, quantity) => {
  return Product.findByIdAndUpdate(
    {
      _id: productId,
      isAvailable: true,
    },
    {
      $inc: {
        quantity: quantity,
        availableQuantity: quantity,
      },
    },
    {
      new: true,
    },
  );
};

//Reserve Stock Atomic
const reveresStockAtomic = (productId, quantity) => {
  return Product.findByIdAndUpdate(
    {
      _id: productId,
      isAvailable: true,
      availableQuantity: { $gte: quantity },
    },
    {
      $inc: {
        reservedQuantity: quantity,
        availableQuantity: -quantity,
      },
    },
    {
      new: true,
    },
  );
};

module.exports = {
  getProduct,
  updateProductInventory,
  createTransaction,
  decreaseStockAtomic,
  increaseStockAtomic,
  reveresStockAtomic
};
