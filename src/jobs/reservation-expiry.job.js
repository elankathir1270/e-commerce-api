const corn = require("node-cron");
const reservationRepository = require("./../repositories/reservation.repository");
const inventoryService = require("./../services/inventory.service");

const processExpiredReservation = async () => {
  const reservations = await reservationRepository.findExpiredReservations();

  if (!reservations) {
    return;
  }

  for (let reservation of reservations) {
    try {
      await inventoryService.releaseReservation({
        reservationId: reservation._id,
        reason: "EXPIRED",
        note: "Reservation expired automatically.",
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const reservationExpiryJob = corn.schedule(
  "* * * * *",
  processExpiredReservation,
  { scheduled: false },
);

module.exports = reservationExpiryJob;
