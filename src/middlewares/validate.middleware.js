const validate = (schema, source = "query") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        status: "Error",
        message: error.details.map((d) => d.message).join(", "),
      });
    }
    req[source] = value;
    next();
  };
};

module.exports = validate;
