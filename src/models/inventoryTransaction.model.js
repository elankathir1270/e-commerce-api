const mongoose = require("mongoose");
const {
  INVENTORY_TRANSACTION_TYPES,
} = require("./../constants/inventory.constants");
const { string } = require("joi");

const inventoryTransactionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: string,
      enum: Object.values(INVENTORY_TRANSACTION_TYPES),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
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

productSchema.index({
  availableQuantity: 1,
  lowStockThreshold: 1
});

//filter by type
inventoryTransactionSchema.index({
  type: 1
});

module.exports = mongoose.model(
  "InventoryTransaction",
  inventoryTransactionSchema,
);
