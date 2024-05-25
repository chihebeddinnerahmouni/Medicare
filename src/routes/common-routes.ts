import express from "express";
import { sendResetPasswordEmail } from "../middlewear/forgot-password";
import { resetPassword } from "../middlewear/reset-forgotten-password";
import { login } from "../middlewear/login";
import { verifyEmail } from "../middlewear/verify-email";
import { signupNurse } from "../controllers/nurses-controllers";
import { signupDoctor } from "../controllers/doctor-controllers";
import { signupPatient } from "../controllers/patient-controllers";
import  authGuard  from "../middlewear/authGuard";
import { logout } from "../middlewear/log-out";
import  searchMedicalStaff  from "../middlewear/search-medical-staff";


const router = express.Router();

//walo
router.get("/", (req, res) => { res.send("Welcome to the Health Care API") });

//signup nurse
router.post("/signup-nurse", signupNurse);

//signup doctor
router.post("/signup-doctor", signupDoctor);

//signup patient
router.post("/signup-patient", signupPatient);

//forget password
router.post("/forgotPassword", sendResetPasswordEmail);

//reset password
router.post("/resetPassword", resetPassword);

//login
router.post("/login", login);

//verifying email
router.get("/verify", verifyEmail);

//logout
router.post("/logout", authGuard, logout);

//search for doctor and nurses
router.get("/search",  searchMedicalStaff);

module.exports = router;