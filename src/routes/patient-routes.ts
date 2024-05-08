import express from "express";
import { getAllPatients, deletePatient, getPatientProfile } from "../controllers/patient-controllers";
import { authGuard } from "../middlewear/authGuard";


const router = express.Router();


//get all patients
router.get("/", getAllPatients);

//delete a patient
router.delete("/:name", deletePatient);

//patient profile
router.get("/profile", authGuard, getPatientProfile);





module.exports = router;