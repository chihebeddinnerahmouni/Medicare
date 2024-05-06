import express from "express";
import {
  getAllDoctors,
  getDoctor,
  deleteDoctor,
  AddAvailableTime
} from "../controllers/doctor-controllers";
import { authGuard } from "../middlewear/authGuard";







const router = express.Router();

// get all doctors
router.get("/",getAllDoctors);

// get one doctor
router.get("/:name", getDoctor);

//add availabletime
router.put("/availabletime-Add", AddAvailableTime);

// delete a doctor
router.delete("/:name", deleteDoctor);


































module.exports = router;
