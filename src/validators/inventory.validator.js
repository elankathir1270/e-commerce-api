const Joi = required("joi");

const objectId = Joi.string().hex().length(24);
const noteSchema = Joi.string().trim().max(500).allow("").optional();
const quantitySchema = Joi.number().integer().positive();

const increaseStockSchema = {
  params: Joi.object({
    productId: objectId.required(),
  }),

  body: Joi.object({
    quantity: quantitySchema.required(),
    note: noteSchema,
  }),
};

const decreaseStockSchema = {
  params: Joi.object({
    productId: objectId.required(),
  }),

  body: Joi.object({
    quantity: quantitySchema.required(),
    note: noteSchema,
  }),
};

const adjustStockSchema = {
  params: Joi.object({
    productId: objectId.required(),
  }),

  body: Joi.object({
    quantity: Joi.number().integer().min(0).required(),
    note: noteSchema,
  }),
};

const reserveStockSchema = {
  params: Joi.object({
    productId: objectId.required(),
  }),

  body: Joi.object({
    quantity: quantitySchema.required(),

    reference: Joi.object({
      type: Joi.string().valid("CART", "ORDER").required(),

      id: Joi.string().trim().required(),
    }).required(),
  }),
};

const releaseReservationSchema = {
  params: Joi.object({
    reservationId: objectId.required(),
  }),

  body: Joi.object({
    reason: Joi.string().valid("CANCELLED", "EXPIRED", "MANUAL").required(),

    note: noteSchema,
  }),
};

const consumeReservationSchema = {
  params: Joi.object({
    reservationId: objectId.required(),
  }),

  body: Joi.object({
    note: noteSchema,
  }),
};


module.exports = {
  increaseStockSchema,
  decreaseStockSchema,
  adjustStockSchema,
  reserveStockSchema,
  releaseReservationSchema,
  consumeReservationSchema,
};
