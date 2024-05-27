import express from 'express';
import {
  signupAdmin,
  loginAdmin,
  getDoctorsAvailableTimes,
  getDoctorSchedules,
  deleteAllDoctors,
  getAllPatients
} from "../controllers/admin-controllers";
import adminAuthGuard from "../middlewear/admin-authGuard";


const router = express.Router();

// signup admin
router.post("/signup", signupAdmin);

// login admin
router.post("/login", loginAdmin);

//get all available times
router.get("/doctors-available-times", getDoctorsAvailableTimes);

//get all shedules
router.get("/schedules", getDoctorSchedules);

//delete all doctors
router.delete("/delete-all-doctors", adminAuthGuard, deleteAllDoctors);

//get all patients
router.get("/patients", adminAuthGuard, getAllPatients);







module.exports = router;