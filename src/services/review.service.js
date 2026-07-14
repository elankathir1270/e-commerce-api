const mongoose = require("mongoose");
const Product = require("./../models/product.model");
const Review = require("./../models/review.model");
const reviewRepository = require("./../repositories/review.repository");
const ApiError = require("./../utils/apiError");

//create Review
const createReview = async (payload) => {
  const product = await Product.findById(payload.productId);

  if (!product) {
    throw new ApiError("Product not found");
  }

  if (product.status !== "ACTIVE") {
    throw new ApiError("Product is inactive");
  }

  const review = await reviewRepository.createReview(payload);

  await recalculateReviewStats(payload.productId);

  return review;
};

//get reviews by productId
const getReviewsByProduct = (productId) => {
  return reviewRepository.getReviewsByProduct(productId);
};

//get review summary
const getReviewSummary = async (productId) => {
  const result = await reviewRepository.getReviewSummary(productId);

  return (
    result[0] || {
      averageRating: 0,
      reviewCount: 0,
    }
  );
};

//update review
const updateReview = async (reviewId, payload) => {
  const review = await reviewRepository.updateReview(reviewId, payload);

  await recalculateReviewStats(review.productId);

  return review;
};

const deleteReview = async (reviewId) => {
  const reviewExist = await Review.findById(reviewId);

  if (!reviewExist) {
    throw new ApiError(404, "Review not found");
  }

  if (reviewExist.isDeleted) {
    throw new ApiError(400, "Review already deleted");
  }
  const review = await reviewRepository.deleteReview(reviewId);

  await recalculateReviewStats(review.productId);

  return review;
};

//helper function
const recalculateReviewStats = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        status: "APPROVED",
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,

        averageRating: {
          $avg: "$rating",
        },

        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);

  const distribution = await Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        status: "APPROVED",
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
  ]);

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  distribution.forEach((item) => {
    ratingDistribution[item._id] = item.count;
  });

  //update product
  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(stats[0].averageRating?.toFixed(1)) || 0,
    reviewCount: Number(stats[0].reviewCount) || 0,
    ratingDistribution,
  });
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewSummary,
  updateReview,
  deleteReview,
};
