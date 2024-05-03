import express from "express";
import { getAllPatients, signupPatient, deletePatient } from "../controllers/patient-controllers";
import { verifyEmail } from "../middlewear/verify-email";


const router = express.Router();

//signup a patient
router.post("/signup", signupPatient);

//verify email
router.get("/verify", verifyEmail);

//get all patients
router.get("/", getAllPatients);

//delete a patient
router.delete("/:name", deletePatient);





module.exports = router;