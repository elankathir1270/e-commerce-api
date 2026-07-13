const Joi = require("joi");

//to validate req.query
const getProductsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),

    limit: Joi.number().integer().min(1).max(100).default(10),

    category: Joi.string(),

    supplier: Joi.string(),

    search: Joi.string(),

    available: Joi.boolean(),

    minPrice: Joi.number().min(0),

    maxPrice: Joi.number().when("minPrice", {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref("minPrice")),
      otherwise: Joi.number().min(0),
    }),

    sort: Joi.string().valid(
      "price",
      "-price",
      "name",
      "-name",
      "createdAt",
      "-createdAt",
    ),
  }),
};

module.exports = {
  getProductsSchema,
};
