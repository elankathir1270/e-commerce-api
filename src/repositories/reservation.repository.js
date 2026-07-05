const InventoryReservation = require("./../models/inventory-reservation.model");

const createReservation = (payload, session = null) => {
  return InventoryReservation.create([payload], { session }).then(
    (result) => result[0],
  );
};

const findActiveReservation = (reservationId, session = null) => {
  return InventoryReservation.findOne({
    _id: reservationId,
    status: "ACTIVE"
}).session(session);
}

const findExpiredReservations = (session = null) => {
  return InventoryReservation.find({
    status: "ACTIVE",

    expiresAt: {
      $lte: new Date(),
    },
  }).session(session);
};

const findByReference = (reference, session = null) => {
  return InventoryReservation.findOne({
    "reference.type": reference.type,

    "reference.id": reference.id,

    status: "ACTIVE",
  }).session(session);
};

const updateReservation = (reservationId, payload, session = null) => {
  return InventoryReservation.findByIdAndUpdate(reservationId, payload, {
    new: true,
    session,
  });
};

module.exports = {
  createReservation,
  findActiveReservation,
  findExpiredReservations,
  findByReference,
  updateReservation,
};
