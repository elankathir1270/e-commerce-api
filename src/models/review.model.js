const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    reviewerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    status: {
      type: String,
      enum: ["APPROVED", "PENDING", "REJECTED"],
      default: "APPROVED"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

reviewSchema.index({
  productId: 1,
  status: 1,
  isDeleted: 1
});

module.exports = mongoose.model(
  "Review",
  reviewSchema
);