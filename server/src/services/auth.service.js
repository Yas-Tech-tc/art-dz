import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

// Number of rounds used by bcrypt to hash passwords.
// If BCRYPT_ROUNDS is not defined in the .env file, use 12 by default.
const ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

// Function to register a new user.
// It receives the user's name, email and password.
export async function registerUser({ name, email, password }) {

  // Hash the password before saving it to the database.
  // ROUNDS controls the complexity of the hashing process.
  const passwordHash = await bcrypt.hash(password, ROUNDS);

  try {
    // Create a new user in MongoDB with the hashed password.
    // The original password is never stored in the database.
    return await User.create({ name, email, passwordHash });

  } catch (err) {

    // MongoDB error code 11000 means a duplicate value was found.
    // In this case, the email is already used by another account.
    if (err.code === 11000) {

      // Return a custom error with HTTP status 409 (Conflict).
      throw new AppError(
        409,
        "EMAIL_TAKEN",
        "Un compte existe déjà avec cette adresse e-mail."
      );
    }

    // If it's another type of error, pass it to the error handler.
    throw err;
  }
}