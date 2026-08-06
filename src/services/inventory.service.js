const inventoryRepository = require("./../repositories/inventory.repository");
const reservationRepository = require("./../repositories/reservation.repository");
const {
  calculateAvailableQuantity,
  createInventorySnapshot,
} = require("./../utils/inventory.utils");
const { INVENTORY_TRANSACTION_TYPES } = require("./../constants/inventory.constants");
const { withTransaction } = require("./../utils/transaction.utils");
const ApiError = require("./../utils/apiError");
const { invalidateInventoryCache } = require("./../cache/cache.invalidation");


//increase stock
const increaseStock = async ({productId, quantity, note}) => {
  const result = await withTransaction(async (session) => {
    const product = await inventoryRepository.getProduct(productId, session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    const snapshot = createInventorySnapshot(product);
    const updatedProduct = await inventoryRepository.increaseStockAtomic(
      productId,
      quantity,
      session,
    );

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
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
    await inventoryRepository.createInventoryTransaction(transaction, session);

    return { snapshot,updatedProduct };
  });

  const { snapshot,updatedProduct } = result;
  await invalidateInventoryCache({previous: snapshot, current: updatedProduct});

  return updatedProduct;

};

//decrease stock
const decreaseStock = async ({productId, quantity, note}) => {
  const result = await withTransaction(async (session) => {
    const product = await inventoryRepository.getProduct(productId, session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    const snapshot = createInventorySnapshot(product);

    const updatedProduct = await inventoryRepository.decreaseStockAtomic(
      productId,
      quantity,
      session,
    );

    if (!updatedProduct) {
      throw new ApiError(400, "Insufficient stock");
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
    await inventoryRepository.createInventoryTransaction(transaction, session);

    return { snapshot,updatedProduct };
  });

  const { snapshot,updatedProduct } = result;
  await invalidateInventoryCache({previous: snapshot, current: updatedProduct});

  return updatedProduct;
};

//adjust stock
const adjustStock = async ({productId, quantity, note}) => {
  const result = await withTransaction(async (session) => {
    // Load Product
    const product = await inventoryRepository.getProduct(productId, session);

    if (!product) {
      throw new ApiError(404, "Product not found");
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
      session,
    );
    
    const adjustmentQuantity = Math.abs(quantity - snapshot.quantity)

    // Build Inventory Transaction
    const transaction = buildInventoryTransaction({
      productId,
      type: INVENTORY_TRANSACTION_TYPES.ADJUSTMENT,
      quantity: adjustmentQuantity, // adjustment difference
      previous: snapshot,
      current: updatedProduct,
      note,
    });

    // Save Inventory Transaction
    await inventoryRepository.createInventoryTransaction(transaction, session);

    return { snapshot,updatedProduct };
  });

  const { snapshot,updatedProduct } = result;
  await invalidateInventoryCache({previous: snapshot, current: updatedProduct});

  return updatedProduct;
};

//reserve stock
const reserveStock = async ({productId, quantity, reference}) => {
  const result = await withTransaction(async (session) => {
    const product = await inventoryRepository.getProduct(productId, session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const snapshot = createInventorySnapshot(product);

    const updatedProduct = await inventoryRepository.reserveStockAtomic(
      productId,
      quantity,
      session,
    );

    if (!updatedProduct) {
      throw new ApiError(400, "Insufficient stock");
    }

    //create reservation
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const reservation = await reservationRepository.createReservation(
      {
        productId,
        quantity,
        reference,
        status: "ACTIVE",
        expiresAt,
      },
      session,
    );

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
    await inventoryRepository.createInventoryTransaction(transaction, session);

    return { reservation,snapshot,updatedProduct };
  });

  const { reservation,snapshot,updatedProduct } = result;
  await invalidateInventoryCache({previous: snapshot, current: updatedProduct});

  return reservation;
};

//release reservation
const releaseReservation = async ({reservationId, reason, note}) => {
  const result = await withTransaction(async (session) => {
    const reservation = await reservationRepository.findActiveReservation(
      reservationId,
      session,
    );

    if (!reservation) {
      throw new ApiError(404, "Reservation not found");
    }

    const product = await inventoryRepository.getProduct(
      reservation.productId,
      session,
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const snapshot = createInventorySnapshot(product);

    const updatedProduct = await inventoryRepository.releaseReservationAtomic(
      reservation.productId,
      reservation.quantity,
      session,
    );

    if (!updatedProduct) {
      throw new ApiError(400, "Failed to release reservation");
    }

    // Update Reservation
    const updatedReservation = await reservationRepository.updateReservation(
      reservationId,
      {
        status: "RELEASED",
        releaseReason: reason,
        releasedAt: new Date(),
      },
      session,
    );

    // Build Inventory Transaction
    const transaction = buildInventoryTransaction({
      productId: reservation.productId,
      type: INVENTORY_TRANSACTION_TYPES.RESERVATION_RELEASE,
      quantity: reservation.quantity,
      previous: snapshot,
      current: updatedProduct,
      note,
    });

    // Save Inventory Transaction
    await inventoryRepository.createInventoryTransaction(transaction, session);

    return { updatedReservation,snapshot,updatedProduct };
  });

  const { updatedReservation,snapshot,updatedProduct } = result;
  await invalidateInventoryCache({previous: snapshot, current: updatedProduct});

  return updatedReservation;
};

//consume reservation
const consumeReservation = async ({reservationId}) => {
  const result = await withTransaction(async (session) => {
    const reservation = await reservationRepository.findActiveReservation(
      reservationId,
      session,
    );

    if (!reservation) {
      throw new ApiError(404, "Reservation not found");
    }

    const product = await inventoryRepository.getProduct(
      reservation.productId,
      session,
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const snapshot = createInventorySnapshot(product);

    const updatedProduct = await inventoryRepository.consumeReservationAtomic(
      reservation.productId,
      reservation.quantity,
      session,
    );

    if (!updatedProduct) {
      throw new ApiError(400, "Failed to consume reservation");
    }
    // Update Reservation
    const updatedReservation = await reservationRepository.updateReservation(
      reservationId,
      {
        status: "CONSUMED",
        consumedAt: new Date(),
      },
      session,
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
    await inventoryRepository.createInventoryTransaction(transaction, session);

    return { updatedReservation,snapshot,updatedProduct };
  });

  const { updatedReservation,snapshot,updatedProduct } = result;
  await invalidateInventoryCache({previous: snapshot, current: updatedProduct});

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
