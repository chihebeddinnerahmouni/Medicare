import express from "express";
import {
    getAllPatients,
    deletePatient,
    getPatientProfile,
    updatePassword,
    updatePatientProfile,
    updatePatientEmail,
    updatePatientProfilePicture,
    updatePatientCoverPicture,
    deleteAllRequests,
    sendReservationRequest
} from "../controllers/patient-controllers";
import authGuard from "../middlewear/authGuard";
import adminAuthGuard from "../middlewear/admin-authGuard";
import upload from "../utils/multer-configs-to-images";


const router = express.Router();


//get all patients
router.get("/",adminAuthGuard, getAllPatients);

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
router.put("/profile/update-profile-picture", upload.single("PatProfPic"), authGuard, updatePatientProfilePicture)

//update cover pic
router.put("/profile/update-cover-picture", upload.single("PatCoverPic"), authGuard, updatePatientCoverPicture)

//delete all requests
router.put("/profile/delete-requests", authGuard, deleteAllRequests)

//reservation
router.put("/profile/send-reservation-request",authGuard, sendReservationRequest);


module.exports = router;