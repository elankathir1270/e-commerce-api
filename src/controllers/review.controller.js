const reviewService = require("./../services/review.service");
const catchAsync = require("./../utils/catchAsync");
const sendResponse = require("./../utils/sendResponse.utils");

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.body);

  sendResponse(res, { statusCode: 201, data: review });
});

const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.reviewId,
    req.body,
  );

  sendResponse(res, { statusCode: 200, data: review });
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.reviewId);

  sendResponse(res, { statusCode: 200, message: "review deleted" });
});

const getReviewsByProduct = catchAsync(async (req, res) => {
  const reviews = await reviewService.getReviewsByProduct(req.params.productId);

  sendResponse(res, { statusCode: 200, data: reviews });
});

const getReviewSummary = catchAsync(async (req, res) => {
  const reviewSummary = await reviewService.getReviewSummary(
    req.params.productId,
  );

  sendResponse(res, { statusCode: 200, data: reviewSummary });
});

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewSummary,
  updateReview,
  deleteReview,
};
