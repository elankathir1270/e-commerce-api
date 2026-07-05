const Product = require("./../models/product.model");
const InventoryTransaction = require("./../models/inventoryTransaction.model");

//get product
const getProduct = (productId, session = null) => {
  return Product.findById(productId).session(session);
};

//create transaction
const createInventoryTransaction = (payload,session = null) => {
  return InventoryTransaction.create(
    [payload],
    { session }
    ).then(result => result[0]);
};

//Atomic Stock Decrease
const decreaseStockAtomic = (productId, quantity, session = null) => {
  return Product.findOneAndUpdate(
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
      session,
    },
  );
};

//Atomic Stock Increase
const increaseStockAtomic = (productId, quantity, session = null) => {
  return Product.findOneAndUpdate(
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
      session,
    },
  );
};

//Reserve Stock Atomic
const reserveStockAtomic = (productId, quantity, session = null) => {
  return Product.findOneAndUpdate(
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
      session,
    },
  );
};

//Release Reservation Atomic
const releaseReservationAtomic = (productId, quantity, session = null) => {
  return Product.findByIdAndUpdate(
    productId,
    {
      $inc: {
        reservedQuantity: -quantity,
        availableQuantity: quantity,
      },
    },
    {
      new: true,
      session,
    },
  );
};

//Consume Reservation Atomic
const consumeReservationAtomic = (productId, quantity, session = null) => {
  return Product.findByIdAndUpdate(
    productId,
    {
      $inc: {
        quantity: -quantity,
        reservedQuantity: -quantity,
      },
    },
    {
      new: true,
      session,
    },
  );
};

const adjustStockAtomic = (
  productId,
  quantity,
  availableQuantity,
  session = null,
) => {
  return Product.findByIdAndUpdate(
    productId,
    {
      quantity,
      availableQuantity,
    },
    {
      new: true,
      session,
    },
  );
};

module.exports = {
  getProduct,
  createInventoryTransaction,
  decreaseStockAtomic,
  increaseStockAtomic,
  reserveStockAtomic,
  releaseReservationAtomic,
  consumeReservationAtomic,
  adjustStockAtomic,
};
