import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validators/auth.validators.js";
import * as authController from "../controllers/auth.controller.js";

// Create a new Express router to manage authentication routes.
const router = Router();

// POST route for user registration.
router.post(
  "/register",
  validate(registerSchema), //validate(registerSchema): checks that the submitted data is valid
  authController.register //authController.register: handles the registration request
);

// Export the router so it can be used in the main application.
export default router;