
import { z } from "zod";
import { CATEGORY_IDS } from "../config/categories.js";

// Schema used to validate product IDs in route parameters.
export const idParam = z.object({
  // The ID must be a 24-character hexadecimal string,
  // which corresponds to the format of a MongoDB ObjectId.
  // The "i" flag allows uppercase and lowercase letters.
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID"),
});

// Schema used to validate query parameters when listing products.
export const listProductsQuery = z.object({

  // Page number:
  // Converts the value to a number, requires an integer,
  // accepts values between 1 and 10000,
  // and defaults to 1 if not provided.
  page: z.coerce.number().int().min(1).max(10000).default(1),

  // Number of products per page:
  // Converts the value to a number, requires an integer,
  // accepts values between 1 and 100,
  // and defaults to 50 products.
  limit: z.coerce.number().int().min(1).max(100).default(50),

  // Product category:
  // Must be one of the category IDs defined in CATEGORY_IDS.
  // This field is optional, so users can retrieve all categories.
  category: z.enum(CATEGORY_IDS).optional(),

  // Search keyword:
  // Must be a string, removes extra spaces,
  // requires at least 1 character,
  // accepts a maximum of 100 characters,
  // and is optional.
  q: z.string().trim().min(1).max(100).optional(),

  // Product sorting option:
  // Accepts only the specified sorting values.
  // Defaults to "newest" if no sorting option is provided.
  sort: z.enum(["newest", "price-asc", "price-desc", "name"]).default("newest"),
});
