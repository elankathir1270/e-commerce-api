const sendResponse = (
  res,
  { statusCode, status = "success", message = "", data = null, meta = null },
) => {
  const response = {
    status,
  };

  if (message !== "") {
    response.message = message;
  }

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;
