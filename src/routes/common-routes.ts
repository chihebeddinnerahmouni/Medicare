import express from "express";
import { sendResetPasswordEmail } from "../middlewear/forgot-password";
import { resetPassword } from "../middlewear/reset-forgotten-password";
import { login } from "../middlewear/login";
import { signup } from "../middlewear/signup";
import { verifyEmail } from "../middlewear/verify-email";

const router = express.Router();

//signup
router.post("/signup", signup);

//forget password
router.post("/forgotPassword", sendResetPasswordEmail);

//reset password
router.post("/resetPassword/:id/:token", resetPassword);

//login
router.post("/login", login);

//verifying email
router.get("/verify", verifyEmail);

module.exports = router;