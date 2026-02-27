import { Router } from "express";
import { register, login } from "./auth.controller";
import { validate } from "../../shared/middleware/validate.middleware";
import { registerSchema, loginSchema } from "../../validators/auth.validator";

const router = Router();

// Register with validation
router.post(
  "/register",
  validate(registerSchema),
  register
);

// Login with validation
router.post(
  "/login",
  validate(loginSchema),
  login
);

export default router;