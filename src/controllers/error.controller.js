const ApiError = require("./../utils/apiError");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stackTrace,
    error: error,
  });
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(error.statusCode).json({
      status: "Error",
      message: "Something went wrong please try again later",
    });
  }
};

const handleCastError = (error) => {
  const errorMessage = `Invalid value ${error.value}, for the property ${error.path}.`;
  return new ApiError(errorMessage, 400);
};

const duplicateKeyHandler = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  const errorMessage = `A document with field - ${field} and value - ${value} is already exist`;
  return new ApiError(errorMessage, 400);
};


module.exports = (error, req, res, next) => {
  ((this.statusCode = this.statusCode || 500),
    (this.status = this.status || "Error"));

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else {
    let apiError = error; //or {...error, message: error.message}
    //{...error} spread way only copies only enumerable properties(ex: error.statusCode) by default Error object properties are NOT enumerable

    if (error.name === "CastError") {
      apiError = handleCastError(error);
    }
    if (error.code === 11000) {
      apiError = duplicateKeyHandler(error);
    }

    prodErrors(res, apiError);
  }
};
