import { ApiError } from "./ApiError.js";

export const ErrorUtils = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ApiError(message, 400);
  }

  // wrong mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ApiError(message, 400);
  }

  // wrong JWT
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, Try again`;
    err = new ApiError(message, 400);
  }

  // expire jwt
  if (err.name === "JsonExpiredError") {
    const message = `Json web token is Expired, Try again`;
    err = new ApiError(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
