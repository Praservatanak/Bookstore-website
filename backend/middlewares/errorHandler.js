import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  if (err.name === "CastError") {
    error = new ApiError(404, "Resource not found");
  }
  if (err.name === "ValidationError") {
    error = new ApiError(
      400,
      Object.values(err.errors).map((e) => e.message),
    );
  }
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token");
  }
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired");
  }
  if (err.code === 11000) {
    error = new ApiError(400, "Duplicated field value entered");
  }
  if (err.code === "ECONNREFUSED") {
    const message = "External server not connected";
    error = new ApiError(502, message);
  }

  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
  };
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

export { errorHandler };
