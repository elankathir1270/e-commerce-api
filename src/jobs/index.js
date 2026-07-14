const reservationExpiryJob = require("./reservation-expiry.job");

const startJobs = () => {
  reservationExpiryJob.start();
  console.log("Reservation Expiry Job Started");

  //scalable (examples)
  //lowStockJob.start();
  //cleanupJob.start();
};

module.exports = {
  startJobs,
};
