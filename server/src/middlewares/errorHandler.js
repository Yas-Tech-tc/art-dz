
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

// Middleware that handles requests to routes that do not exist.
// Creates a 404 error and passes it to the central error handler.
export function notFound(req, res, next) {
  next(
    new AppError(
      404,
      "ROUTE_NOT_FOUND",
      "Resource not found."
    )
  );
}

// Converts different types of errors into AppError
// so that all errors follow the same format.
function toAppError(err) {

  // If the error is already an AppError, return it directly.
  if (err instanceof AppError) return err;

  // Handles invalid JSON sent by the client.
  if (err.type === "entity.parse.failed") {
    return new AppError(
      400,
      "INVALID_JSON",
      "Request body is not valid JSON."
    );
  }

  // Handles requests whose body exceeds the allowed size.
  if (err.type === "entity.too.large") {
    return new AppError(
      413,
      "PAYLOAD_TOO_LARGE",
      "Request payload is too large."
    );
  }

  // Handles Mongoose validation errors
  // when data does not respect the schema rules.
  if (err instanceof mongoose.Error.ValidationError) {
    return new AppError(
      400,
      "VALIDATION_ERROR",
      "The submitted data is invalid."
    );
  }

  // Handles invalid IDs that cannot be converted to MongoDB ObjectIds.
  if (err instanceof mongoose.Error.CastError) {
    return new AppError(
      400,
      "INVALID_ID",
      "Invalid ID."
    );
  }

  // Handles MongoDB error code 11000 (duplicate key).
  // Example: a user tries to register with an email that already exists.
  if (err.code === 11000) {
    return new AppError(
      409,
      "DUPLICATE",
      "This resource already exists."
    );
  }

  // If none of the conditions match, the error is unknown.
  return null;
}

// Central error-handling middleware.
// Receives errors and sends the appropriate JSON response to the client.
export function errorHandler(err, req, res, next) {

  // Try to recognize and convert the error into an AppError.
  const known = toAppError(err);

  // If the error is unknown, treat it as an unexpected server error.
  if (!known) {

    // Log technical error information in the server console
    // to help the developer identify and debug the problem.
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);

    // Send a generic response without exposing internal server details.
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An internal server error occurred."
      },
    });
  }

  //  else Create an object containing the error code and message.
  const error = {
    code: known.code,
    message: known.message
  };

  // Add additional details if they are available.
  if (known.details) {
    error.details = known.details;
  }

  // Send the final JSON response with the appropriate HTTP status code.
  res.status(known.status).json({
    success: false,
    error
  });
}
