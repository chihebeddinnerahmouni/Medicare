import express from "express";
import {
  getAllDoctors,
  deleteDoctor,
  AddAvailableTime,
  getDoctorProfile,
  updatePassword,
  updateDoctorEmail,
  updateDoctorProfile
} from "../controllers/doctor-controllers";
import  authGuard  from "../middlewear/authGuard";







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

//update profile
router.put("/profile/update-profile", authGuard, updateDoctorProfile);

//update email
router.put("/profile/update-email", authGuard, updateDoctorEmail);




































module.exports = router;
