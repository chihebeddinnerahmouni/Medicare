import express from "express";
import { sendResetPasswordEmail } from "../middlewear/forgot-password";
import { resetPassword } from "../middlewear/reset-forgotten-password";
import { login } from "../middlewear/login";
import { verifyEmail } from "../middlewear/verify-email";
import { signupNurse } from "../controllers/nurses-controllers";
import { signupDoctor } from "../controllers/doctor-controllers";
import { signupPatient } from "../controllers/patient-controllers";


const router = express.Router();

//signup nurse
router.post("/signup-nurse", signupNurse);

//signup doctor
router.post("/signup-doctor", signupDoctor);

//signup patient
router.post("/signup-patient", signupPatient);

//forget password
router.post("/forgotPassword", sendResetPasswordEmail);

//reset password
router.post("/resetPassword/:id/:token", resetPassword);

//login
router.post("/login", login);

//verifying email
router.get("/verify", verifyEmail);

module.exports = router;