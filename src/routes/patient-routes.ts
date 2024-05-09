import express from "express";
import {
    getAllPatients,
    deletePatient,
    getPatientProfile,
    updatePassword,
    updatePatientProfile,
    updatePatientEmail
} from "../controllers/patient-controllers";
import  authGuard  from "../middlewear/authGuard";


const router = express.Router();


//get all patients
router.get("/", getAllPatients);

//delete a patient
router.delete("/:name", deletePatient);

//patient profile
router.get("/profile", authGuard, getPatientProfile);

//update password
router.put("/profile/update-password", authGuard, updatePassword);

//update profile
router.put("/profile/update-profile", authGuard, updatePatientProfile);

//update email
router.put("/profile/update-email", authGuard, updatePatientEmail);




module.exports = router;