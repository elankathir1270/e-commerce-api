const inventoryService = require("./../services/inventory.service");
const sendResponse = require("./../utils/sendResponse.utils");

const increaseStock = async (req, res, next) => {
  try {
    const product = await inventoryService.increaseStock({
      productId: req.params.productId,
      quantity: req.body.quantity,
      note: req.body.note,
    });

    sendResponse(res, {
      statusCode: 200,
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

    sendResponse(res, {
      statusCode: 200,
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

    sendResponse(res, {
      statusCode: 200,
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

    sendResponse(res, {
      statusCode: 201,
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

    sendResponse(res, {
      statusCode: 200,
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

    sendResponse(res, {
      statusCode: 200,
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
