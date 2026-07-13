const inventoryRepository = require("./../repositories/inventory.repository");
const reservationRepository = require("./../repositories/reservation.repository");
const {
  calculateAvailableQuantity,
  createInventorySnapshot,
} = require("./../utils/inventory.utils");
const {
  INVENTORY_TRANSACTION_TYPES,
} = require("./../constants/inventory.constants");

//increase stock
const increaseStock = async (productId, quantity,note) => {
  const product = await inventoryRepository.getProduct(productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }
  const snapshot = createInventorySnapshot(product);
  const updatedProduct = await inventoryRepository.increaseStockAtomic(
    productId,
    quantity,
  );

  if (!updatedProduct) {
    throw new Error(404, "Product not found");
  }

  //Build Inventory Transaction
  const transaction = buildInventoryTransaction({
    productId,
    type: INVENTORY_TRANSACTION_TYPES.PURCHASE,
    quantity,
    previous: snapshot,
    current: updatedProduct,
    note,
  });
  //create inventory log
  await inventoryRepository.createInventoryTransaction(transaction);

  return updatedProduct;
};

//decrease stock
const decreaseStock = async (productId, quantity,note) => {
  const product = await inventoryRepository.getProduct(productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }
  const snapshot = createInventorySnapshot(product);

  const updatedProduct = await inventoryRepository.decreaseStockAtomic(
    productId,
    quantity,
  );

  if (!updatedProduct) {
    throw new Error(400, "Insufficient stock");
  }

  //Build Inventory Transaction
  const transaction = buildInventoryTransaction({
    productId,
    type: INVENTORY_TRANSACTION_TYPES.SALE,
    quantity,
    previous: snapshot,
    current: updatedProduct,
    note,
  });
  //create inventory log
  await inventoryRepository.createInventoryTransaction(transaction);

  return updatedProduct;
};

//adjust stock
const adjustStock = async (productId, quantity, note) => {
  // Load Product
  const product = await inventoryRepository.getProduct(productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }

  // Snapshot
  const snapshot = createInventorySnapshot(product);

  // Calculate new available quantity
  const availableQuantity = calculateAvailableQuantity(
    quantity,
    product.reservedQuantity,
  );

  // Adjust Stock
  const updatedProduct = await inventoryRepository.adjustStockAtomic(
    productId,
    quantity,
    availableQuantity,
  );

  // Build Inventory Transaction
  const transaction = buildInventoryTransaction({
    productId,
    type: INVENTORY_TRANSACTION_TYPES.ADJUSTMENT,
    quantity: quantity - snapshot.quantity, // adjustment difference
    previous: snapshot,
    current: updatedProduct,
    note,
  });

  // Save Inventory Transaction
  await inventoryRepository.createInventoryTransaction(transaction);

  return updatedProduct;
};

//reserve stock
const reserveStock = async (productId, quantity, reference) => {
  const product = await inventoryRepository.getProduct(productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }

  const snapshot = createInventorySnapshot(product);

  const updatedProduct = await inventoryRepository.reserveStockAtomic(
    productId,
    quantity,
  );

  if (!updatedProduct) {
    throw new Error(400, "Insufficient stock");
  }

  //create reservation
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const reservation = await reservationRepository.createReservation({
    productId,
    quantity,
    reference,
    status: "ACTIVE",
    expiresAt,
  });

  //Build Inventory Transaction
  const transaction = buildInventoryTransaction({
    productId,
    type: INVENTORY_TRANSACTION_TYPES.RESERVATION,
    quantity,
    previous: snapshot,
    current: updatedProduct,
    note: `Reserved for ${reference.type} (${reference.id})`,
  });
  //create inventory log
  await inventoryRepository.createInventoryTransaction(transaction);

  return reservation;
};

//release reservation
const releaseReservation = async (reservationId,reason,note) => {
  const reservation =
    await reservationRepository.findActiveReservation(reservationId);

  if (!reservation) {
    throw new Error(404, "Reservation not found");
  }

  const product = await inventoryRepository.getProduct(reservation.productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }

  const snapshot = createInventorySnapshot(product);

  const updatedProduct = await inventoryRepository.releaseReservationAtomic(
    reservation.productId,
    reservation.quantity,
  );

  if (!updatedProduct) {
    throw new Error(400, "Failed to release reservation");
  }

  // Update Reservation
  const updatedReservation = await reservationRepository.updateReservation(
    reservationId,
    {
      status: "RELEASED",
      releaseReason: reason,
      releasedAt: new Date(),
    },
  );

  // Build Inventory Transaction
  const transaction = buildInventoryTransaction({
    productId: reservation.productId,
    type: INVENTORY_TRANSACTION_TYPES.RELEASE,
    quantity: reservation.quantity,
    previous: snapshot,
    current: updatedProduct,
    note,
  });

  // Save Inventory Transaction
  await inventoryRepository.createInventoryTransaction(transaction);

  return updatedReservation;
};

//consume reservation
const consumeReservation = async (reservationId) => {
  const reservation =
    await reservationRepository.findActiveReservation(reservationId);

  if (!reservation) {
    throw new Error(404, "Reservation not found");
  }

  const product = await inventoryRepository.getProduct(reservation.productId);

  if (!product) {
    throw new Error(404, "Product not found");
  }

  const snapshot = createInventorySnapshot(product);

  const updatedProduct = await inventoryRepository.consumeReservationAtomic(
    reservation.productId,
    reservation.quantity,
  );

  if (!updatedProduct) {
    throw new Error(400, "Failed to consume reservation");
  }
  // Update Reservation
  const updatedReservation = await reservationRepository.updateReservation(
    reservationId,
    {
      status: "CONSUMED",
      consumedAt: new Date(),
    },
  );

  // Build Inventory Transaction
  const transaction = buildInventoryTransaction({
    productId: reservation.productId,
    type: INVENTORY_TRANSACTION_TYPES.SALE,
    quantity: reservation.quantity,
    previous: snapshot,
    current: updatedProduct,
    note: `Consumed reservation for ${reservation.reference.type} (${reservation.reference.id})`,
  });

  // Save Inventory Transaction
  await inventoryRepository.createInventoryTransaction(transaction);

  return updatedReservation;
};

const buildInventoryTransaction = ({
  productId,
  type,
  quantity,
  previous,
  current,
  note,
}) => ({
  productId,
  type,
  quantity,

  previousQuantity: previous.quantity,

  newQuantity: current.quantity,

  previousReservedQuantity: previous.reservedQuantity,

  newReservedQuantity: current.reservedQuantity,

  previousAvailableQuantity: previous.availableQuantity,

  newAvailableQuantity: current.availableQuantity,

  note,
});

module.exports = {
  increaseStock,
  decreaseStock,
  adjustStock,
  reserveStock,
  releaseReservation,
  consumeReservation,
};
