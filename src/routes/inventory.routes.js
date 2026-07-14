const express = require("express");
const inventoryController = require('./../controllers/inventory.controller');
const validate = require('./../middlewares/validate.middleware');
const {
  increaseStockSchema,
  decreaseStockSchema,
  adjustStockSchema,
  reserveStockSchema,
  releaseReservationSchema,
  consumeReservationSchema,
} = require('./../validators/inventory.validator');

const inventoryRouter = express.Router();

//Stock Management
inventoryRouter.route("/:productId/increase")
.patch(validate(increaseStockSchema),inventoryController.increaseStock);

inventoryRouter.route("/:productId/decrease")
.patch(validate(decreaseStockSchema),inventoryController.decreaseStock);

inventoryRouter.route("/:productId/adjust")
.patch(validate(adjustStockSchema),inventoryController.adjustStock);

//Reservation Management
inventoryRouter.route("/:productId/reserve")
.post(validate(reserveStockSchema), inventoryController.reserveStock);

inventoryRouter.route("/reservations/:reservationId/release")
.patch(validate(releaseReservationSchema), inventoryController.releaseReservation);

inventoryRouter.route("/reservations/:reservationId/consume")
.patch(validate(consumeReservationSchema),inventoryController.consumeReservation);


/**
-- Increase, decrease, and adjust stock → Admin or Warehouse roles only.
-- Reserve and consume inventory → Typically called internally by the Cart or Checkout service, not exposed as public APIs.
-- Release reservation → Triggered by Cart, Checkout, or the background expiry job.


Method	Endpoint	                                    Description
PATCH	/inventory/:productId/increase	                Increase stock
PATCH	/inventory/:productId/decrease	                Decrease stock
PATCH	/inventory/:productId/adjust	                Set stock to an exact quantity
POST	/inventory/:productId/reserve	                Reserve inventory
PATCH	/inventory/reservations/:reservationId/release	Release reservation
PATCH	/inventory/reservations/:reservationId/consume	Convert reservation into a sale

 */


module.exports = inventoryRouter;
