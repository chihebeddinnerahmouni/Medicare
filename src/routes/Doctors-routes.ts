import express from "express";
import {
  getAllDoctors,
  deleteDoctor,
  AddAvailableTime,
  getDoctorProfile,
  updatePassword,
  updateDoctorEmail,
  updateDoctorProfile,
  updateDoctorProfilePicture,
} from "../controllers/doctor-controllers";
import authGuard from "../middlewear/authGuard";
import upload from "../utils/multer-configs-to-images";














const router = express.Router();

// get all doctors
router.get("/",getAllDoctors);

//add availabletime
router.put("/availabletime-Add", AddAvailableTime);

// delete a doctor
router.delete("/:name", deleteDoctor);

//doctor profile
router.get("/profile", authGuard, getDoctorProfile);

//update password
router.put("/profile/update-password", authGuard, updatePassword);

//update email
router.put("/profile/update-email", authGuard, updateDoctorEmail);

//update profile
router.put("/profile/update-profile", authGuard, updateDoctorProfile);

//update profile pic
router.put("/profile/update-profile-picture",upload.single("profilePicture"),authGuard,updateDoctorProfilePicture)



































module.exports = router;
