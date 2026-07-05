const mongoose = require("mongoose");

const inventoryReservationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    reference: {
      type: {
        type: String,
        enum: ["CART", "ORDER"],
      },

      id: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "RELEASED", "CONSUMED"],
      default: "ACTIVE",
    },

    releaseReason: {
      type: String,
      enum: ["CANCELLED", "EXPIRED", "MANUAL"],
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    releasedAt: {
      type: Date,
      default: null,
    },

    consumedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//Reservation Expiry Job
inventoryReservationSchema.index({
  status: 1,
  expiresAt: 1,
});

//Find reservation by cart
inventoryReservationSchema.index({
  referenceType: 1,
  referenceId: 1,
  status: 1,
});

//Find product reservations
inventoryReservationSchema.index({
  productId: 1,
  status: 1,
});

module.exports = mongoose.model(
  "InventoryReservation",
  inventoryReservationSchema,
);
