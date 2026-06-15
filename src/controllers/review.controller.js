const reviewService = require("./../services/review.service");

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body);

    res.status(201).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.reviewId,req.body);

    res.status(200).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.reviewId);

    res.status(200).json({
      status: "success",
      message: "review deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByProduct(req.params.productId);

    res.status(200).json({
      status: "success",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const getReviewSummary = async (req, res, next) => {
  try {
    const reviewSummary = await reviewService.getReviewSummary(req.params.productId);

    res.status(200).json({
      status: "success",
      data: reviewSummary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewSummary,
  updateReview,
  deleteReview
};
