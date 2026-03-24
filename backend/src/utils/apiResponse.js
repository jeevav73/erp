class ApiResponse {
  constructor(statusCode, data, message) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

const sendResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, null, message));
};

module.exports = {
  ApiResponse,
  sendResponse,
  sendError
};
