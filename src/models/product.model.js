const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      maxlength: 500,
    },

    description: {
      type: String,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: {
      type: Number,
      min: 0,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    images: [
      {
        type: String,
      },
    ],

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    averageRating: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    ratingDistribution: {
      5: {type: Number, default: 0},
      4: {type: Number, default: 0},
      3: {type: Number, default: 0},
      2: {type: Number, default: 0},
      1: {type: Number, default: 0},
    }
    
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ categoryId: 1 });
productSchema.index({ supplierId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ createdAt: -1 });

//search index
productSchema.index({
    name: "text",
    shortDescription: "text",
    description: "text"
})

//validate sales price before saving to db
productSchema.pre('save', async function(){
    if(this.salePrice && this.salePrice > this.price) {
        throw new Error("Sale price cannot be greater than price");
    }
})

module.exports = mongoose.model("Product", productSchema);
