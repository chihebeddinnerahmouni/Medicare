import express from "express";
import { getAllPatients, deletePatient } from "../controllers/patient-controllers";
import { verifyEmail } from "../middlewear/verify-email";


const router = express.Router();

//verify email
router.get("/verify", verifyEmail);

//get all patients
router.get("/", getAllPatients);

//delete a patient
router.delete("/:name", deletePatient);





module.exports = router;