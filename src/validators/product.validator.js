const Joi = require("joi");
const objectId = Joi.string().hex().length(24);

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

const updateProductSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),

  body: Joi.object({
    name: Joi.string()
      .trim()
      .max(200),

    shortDescription: Joi.string()
      .trim()
      .max(500),

    description: Joi.string()
      .trim(),

    categoryId: objectId,

    supplierId: objectId,

    brand: Joi.string()
      .trim(),

    price: Joi.number()
      .min(0),

    salePrice: Joi.number()
      .min(0),

    images: Joi.array().items(
      Joi.string().trim().uri()
    ),

    specifications: Joi.object()
      .pattern(
        Joi.string(),
        Joi.string().allow("")
      ),

    status: Joi.string().valid(
      "ACTIVE",
      "INACTIVE"
    ),
  })
    .min(1)
    .custom((value, helpers) => {
      if (
        value.price !== undefined &&
        value.salePrice !== undefined &&
        value.salePrice > value.price
      ) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .messages({
      "any.invalid":
        "Sale price cannot be greater than price.",
    }),
};

module.exports = {
  getProductsSchema,
  updateProductSchema
};
