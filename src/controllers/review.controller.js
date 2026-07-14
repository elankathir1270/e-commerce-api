const reviewService = require("./../services/review.service");
const sendResponse = require("./../utils/sendResponse.utils");

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body);

    sendResponse(res, { statusCode: 201, data: review });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      req.params.reviewId,
      req.body,
    );

    sendResponse(res, { statusCode: 200, data: review });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.reviewId);

    sendResponse(res, { statusCode: 200, message: "review deleted" });
  } catch (error) {
    next(error);
  }
};

const getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByProduct(
      req.params.productId,
    );

    sendResponse(res, { statusCode: 200, data: reviews });
  } catch (error) {
    next(error);
  }
};

const getReviewSummary = async (req, res, next) => {
  try {
    const reviewSummary = await reviewService.getReviewSummary(
      req.params.productId,
    );

    sendResponse(res, { statusCode: 200, data: reviewSummary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewSummary,
  updateReview,
  deleteReview,
};
