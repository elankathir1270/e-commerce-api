const mongoose = require("mongoose");
const {
  INVENTORY_TRANSACTION_TYPES,
} = require("./../constants/inventory.constants");

const inventoryTransactionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(INVENTORY_TRANSACTION_TYPES),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    previousQuantity: Number,

    newQuantity: Number,

    previousReservedQuantity: Number,

    newReservedQuantity: Number,

    previousAvailableQuantity: Number,

    newAvailableQuantity: Number,
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//filter by type
inventoryTransactionSchema.index({
  type: 1,
});

module.exports = mongoose.model(
  "InventoryTransaction",
  inventoryTransactionSchema,
);
