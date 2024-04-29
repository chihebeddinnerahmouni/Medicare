import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  getAllDoctors,
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  login
} from "../controllers/doctor-controllers";
import { sendResetPasswordEmail } from "../middlewear/forgot-password";
import { resetPassword } from "../middlewear/reset-forgotten-password";
import { verifyEmail } from "../middlewear/verify-email";







const router = express.Router();

//signup
router.post("/signup", createDoctor);

//verify signup code
router.get("/verify", verifyEmail);

// login
router.post("/login", login);

//forgoten password
router.post("/forgotPassword", sendResetPasswordEmail);

//reset paswword
router.post("/resetPassword/:id/:token", resetPassword);

// get all doctors
router.get("/", getAllDoctors);

// get one doctor
router.get("/:name", getDoctor);

// update a doctor
router.put("/:name", updateDoctor);

// delete a doctor
router.delete("/:name", deleteDoctor);


































module.exports = router;
