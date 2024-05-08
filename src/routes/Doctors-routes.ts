import express from "express";
import {
  getAllDoctors,
  deleteDoctor,
  AddAvailableTime,
  getDoctorProfile,
} from "../controllers/doctor-controllers";
import { authGuard } from "../middlewear/authGuard";







const router = express.Router();

// get all doctors
router.get("/",getAllDoctors);

//add availabletime
router.put("/availabletime-Add", AddAvailableTime);

// delete a doctor
router.delete("/:name", deleteDoctor);

//doctor profile
router.get("/profile", authGuard, getDoctorProfile);


































module.exports = router;
