import express from "express";
import { sendResetPasswordEmail } from "../middlewear/forgot-password";
import { resetPassword } from "../middlewear/reset-forgotten-password";
import { login } from "../middlewear/login";

const router = express.Router();

//forget password
router.post("/forgotPassword", sendResetPasswordEmail);

//reset password
router.post("/resetPassword/:id/:token", resetPassword);

//login
router.post("/login", login);

module.exports = router;