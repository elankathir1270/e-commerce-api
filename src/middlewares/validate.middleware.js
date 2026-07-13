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
        return res.status(400).json({
          status: "Error",
          message: error.details
            .map((d) => d.message)
            .join(", "),
        });
      }

      req[source] = value;
    }

    next();
  };
};

module.exports = validate;