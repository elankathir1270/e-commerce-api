const mongoose = require("mongoose");
const Review = require("./../models/review.model");

const createReview = (payload) => {
  return Review.create(payload);
};

const getReviewsByProduct = (productId) => {
  return Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        status: "APPROVED",
        isDeleted: false
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        reviewerName: 1,
        rating: 1,
        comment: 1,
        createdAt: 1,
      },
    },
  ]);
};

const getReviewSummary = (productId) => {
  return Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        status: "APPROVED",
        isDeleted: false
      },
    },
    {
      $group: {
        _id: productId,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);
};

const updateReview = (id, payload) => {
  return Review.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true
    }
  );
};

const deleteReview = (id) => {
  return Review.findByIdAndUpdate(id, 
    { isDeleted: true },
    { new: true }
  );
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewSummary,
  updateReview,
  deleteReview
};