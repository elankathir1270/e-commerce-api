const ApiError = require("./../utils/apiError");

const validate = (schema) => {
  return (req, res, next) => {
    const sources = ["params", "query", "body"];

    for (const source of sources) {
      if (!schema[source]) continue;

      const { error, value } = schema[source].validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const messages = error.details.map((d) => d.message);
        return next(new ApiError(400, messages.join(", ")));
      }

      req[source] = value;
    }

    next();
  };
};

module.exports = validate;
