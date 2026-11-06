import { z } from "zod";

// Email validation rules
const email = z
  .string()                       // The email must be a string.
  .trim()                         // Remove spaces at the beginning and end.
  .toLowerCase()                  // Convert the email to lowercase.
  .max(254)                       // Limit the email to 254 characters.
  .pipe(z.email("Adresse e-mail invalide")); // Check if the email format is valid.

// Password validation rules
const password = z
  .string()                       // The password must be a string.
  .min(10, "10 caractères minimum") // Require at least 10 characters.

  // Check that the password does not exceed 72 bytes in UTF-8.
  // This is important because bcrypt only processes up to 72 bytes.
  .refine(
    (value) => Buffer.byteLength(value, "utf8") <= 72,
    "72 octets maximum"
  )

  // Require at least one letter and one digit.
  .refine(
    (value) => /[A-Za-z]/.test(value) && /\d/.test(value),
    "Doit contenir au moins une lettre et un chiffre"
  );

// Schema used to validate the registration data.
export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(60), // Name: 2 to 60 characters.
    email,                                 // Apply the email validation rules.
    password,                              // Apply the password validation rules.
  })
  .strict(); // Reject any additional fields not defined in this schema.