
import { z } from "zod";
import { AppError } from "../utils/AppError.js";

// Configure Zod to display validation error messages in French.
z.config(z.locales.fr());

// Middleware factory that validates a specific part of the request.
// "schema" defines the validation rules.
// "source" specifies which request part to validate (body, query, or params).
export const validate = (schema, source = "body") => (req, res, next) => {

  // Validate the selected request data without throwing an exception.
  const result = schema.safeParse(req[source]);

  // If validation fails, prepare the validation error details.
  if (!result.success) {

    // Extract the field name and error message for each validation issue.
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || source, // Field that contains the error.
      message: issue.message,              // Explanation of the validation error.
    }));

    // Throw a custom 400 error containing the validation details.
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "The submitted data is invalid.",
      details
    );
  }

  // Store the validated and cleaned data in req.valid.
  // This preserves previously validated request data from other sources.
  req.valid = { ...req.valid, [source]: result.data };

  // Continue to the next middleware or controller.
  next();
};
