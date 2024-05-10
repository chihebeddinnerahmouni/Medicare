import express from "express";
import {
    getAllPatients,
    deletePatient,
    getPatientProfile,
    updatePassword,
    updatePatientProfile,
    updatePatientEmail,
    updatePatientProfilePicture
} from "../controllers/patient-controllers";
import authGuard from "../middlewear/authGuard";
import upload from "../utils/multer-configs-to-images";


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

//update profile pic
router.put("/profile/update-profile-picture",upload.single("profilePicture"),authGuard,updatePatientProfilePicture)




module.exports = router;