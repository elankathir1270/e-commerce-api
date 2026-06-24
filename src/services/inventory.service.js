const inventoryRepository = require("./../repositories/inventory.repository");
const { calculateAvailableQuantity } = require("./../utils/inventory.utils");

//increase stock
const increaseStock = async (productId, quantity, note) => {
  const product = await inventoryRepository.getProduct(productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }

  const previousStock = product.quantity;

  const newStock = previousStock + quantity;

  const availableQuantity = calculateAvailableQuantity(
    newStock,
    product.reservedQuantity,
  );

  //update to product
  const updateProduct = await inventoryRepository.updateProductInventory(
    productId,
    {
      quantity: newStock,
      availableQuantity,
    },
  );

  //create inventory log
  await inventoryRepository.createTransaction({
    productId,
    type: "PURCHASE",
    quantity,
    previousStock,
    newStock,
    note,
  });

  return updateProduct;
};

//decrease stock
const decreaseStock = async (productId, quantity, note) => {
  const product = await inventoryRepository.getProduct(productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }

  if (quantity > product.availableQuantity) {
    throw new Error(400, "Insufficient stock");
  }

  const previousStock = product.quantity;

  const newStock = previousStock - quantity;

  const availableQuantity = calculateAvailableQuantity(
    newStock,
    product.reservedQuantity,
  );

  //update product
  const updateProduct = await inventoryRepository.updateProductInventory(
    productId,
    {
      quantity: newStock,
      availableQuantity,
    },
  );

  //create inventory log
  await inventoryRepository.createTransaction({
    productId,
    type: "SALE",
    quantity,
    previousStock,
    newStock,
    note,
  });

  return updateProduct;
};

//adjust stock
const adjustStock = async (productId,quantity,note) => {
    const product = await inventoryRepository.getProduct(productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }

  const previousStock = product.quantity;
  
  const newStock = quantity;

  const availableQuantity = calculateAvailableQuantity(newStock, product.reservedQuantity);

    //update product
  const updateProduct = await inventoryRepository.updateProductInventory(
    productId,
    {
      quantity: newStock,
      availableQuantity,
    },
  );

  //create inventory log
  await inventoryRepository.createTransaction({
    productId,
    type: "ADJUSTMENT",
    quantity: newStock - previousStock, //here quantity represents adjusted quantity nos.
    previousStock,
    newStock,
    note,
  });

  return updateProduct;
}

module.exports = { increaseStock,decreaseStock,adjustStock }
