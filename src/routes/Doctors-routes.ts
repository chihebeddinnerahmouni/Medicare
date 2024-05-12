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
  updateDoctorCoverPicture,
  searchDoctor,
  deleteAllAvailableTimes,
  sendreservationRequest,
} from "../controllers/doctor-controllers";
import authGuard from "../middlewear/authGuard";
import upload from "../utils/multer-configs-to-images";














const router = express.Router();

// get all doctors
router.get("/",getAllDoctors);

// delete a doctor
router.delete("/:name", deleteDoctor);

// search doctor
router.get("/search", searchDoctor);

//add availabletime
router.put("/profile/availabletime-Add", authGuard, AddAvailableTime);

//doctor profile
router.get("/profile", authGuard, getDoctorProfile);

//update password
router.put("/profile/update-password", authGuard, updatePassword);

//update email
router.put("/profile/update-email", authGuard, updateDoctorEmail);

//update profile
router.put("/profile/update-profile", authGuard, updateDoctorProfile);

//update profile pic
router.put("/profile/update-profile-picture", upload.single("DocProfPic"), authGuard, updateDoctorProfilePicture)

//update cover pic
router.put("/profile/update-cover-picture",upload.single("DocCoverPic"),authGuard,updateDoctorCoverPicture);

// delete all available times
router.put("/profile/delete-all-available-times", authGuard, deleteAllAvailableTimes);

//reservation
router.put("/send-reservation-request", sendreservationRequest);
































module.exports = router;
