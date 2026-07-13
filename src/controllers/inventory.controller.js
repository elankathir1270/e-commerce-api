const inventoryService = require("./../services/inventory.service");

const increaseStock = async (req, res, next) => {
  try {
    const product = await inventoryService.increaseStock({
      productId: req.params.productId,
      quantity: req.body.quantity,
      note: req.body.note,
    });

    res.status(200).json({
      status: "success",
      message: "Stock increased successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const decreaseStock = async (req, res, next) => {
  try {
    const product = await inventoryService.decreaseStock({
      productId: req.params.productId,
      quantity: req.body.quantity,
      note: req.body.note,
    });

    res.status(200).json({
      status: "success",
      message: "Stock decreased successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const adjustStock = async (req, res, next) => {
  try {
    const product = await inventoryService.adjustStock({
      productId: req.params.productId,
      quantity: req.body.quantity,
      note: req.body.note,
    });

    res.status(200).json({
      status: "success",
      message: "Stock adjusted successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const reserveStock = async (req, res, next) => {
  try {
    const reservation = await inventoryService.reserveStock({
      productId: req.params.productId,
      quantity: req.body.quantity,
      reference: {
        type: req.body.reference.type,
        id: req.body.reference.id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Inventory reserved successfully.",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const releaseReservation = async (req, res, next) => {
  try {
    const reservation = await inventoryService.releaseReservation({
      reservationId: req.params.reservationId,
      reason: req.body.reason,
      note: req.body.note,
    });

    res.status(200).json({
      status: "success",
      message: "Reservation released successfully.",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const consumeReservation = async (req, res, next) => {
  try {
    const reservation = await inventoryService.consumeReservation({
      reservationId: req.params.reservationId,
      note: req.body.note,
    });

    res.status(200).json({
      status: "success",
      message: "Reservation consumed successfully.",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  increaseStock,
  decreaseStock,
  adjustStock,
  reserveStock,
  releaseReservation,
  consumeReservation,
};
