const Product = require("./../models/product.model");
const Review = require("./../models/review.model");
const reviewRepository = require("./../repositories/review.repository");

//create Review
const createReview = async (payload) => {
  const product = await Product.findById(payload.productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.status !== "ACTIVE") {
    throw new Error("Product is inactive");
  }

  return reviewRepository.createReview(payload);
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
const updateReview = (reviewId, payload) => {
  return reviewRepository.updateReview(reviewId, payload);
};

const deleteReview = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.isDeleted) {
    throw new ApiError(400, "Review already deleted");
  }
  return reviewRepository.deleteReview(reviewId);
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewSummary,
  updateReview,
  deleteReview,
};
