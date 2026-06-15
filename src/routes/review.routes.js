const express = require('express');
const validate = require("./../middlewares/validate.middleware");
const reviewController = require("./../controllers/review.controller");
const { createReviewSchema,updateReviewSchema } = require("./../validators/review.validator");


const reviewRouter = express.Router();

reviewRouter.route("/product/:productId")
.get(reviewController.getReviewsByProduct);


reviewRouter.route("/summary/:productId")
.get(reviewController.getReviewSummary);


reviewRouter.route("/")
.post(validate(createReviewSchema,"body"),reviewController.createReview)

reviewRouter.route("/:reviewId")
.patch(validate(updateReviewSchema,"body"),reviewController.updateReview)
.delete(reviewController.deleteReview)

module.exports = reviewRouter;