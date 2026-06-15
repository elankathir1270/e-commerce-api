const Joi = require("joi");

const createReviewSchema = Joi.object({
  productId: Joi.string().required(),

  reviewerName: Joi.string().required().max(100),

  rating: Joi.number().min(1).max(5).required(),

  comment: Joi.string().required().max(1000),
});

const updateReviewSchema = Joi.object({
  reviewerName: Joi.string().trim().max(100),

  rating: Joi.number().min(1).max(5),

  comment: Joi.string().trim().max(1000),

  status: Joi.string().valid("APPROVED", "PENDING", "REJECTED"),
}).min(1);

module.exports = { createReviewSchema, updateReviewSchema };
