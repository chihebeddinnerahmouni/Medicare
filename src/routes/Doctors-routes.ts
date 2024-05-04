import express from "express";
import {
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor-controllers";
import { authGuard } from "../middlewear/authGuard";







const router = express.Router();

// get all doctors
router.get("/",getAllDoctors);

// get one doctor
router.get("/:name", getDoctor);

// update a doctor
router.put("/:name", updateDoctor);

// delete a doctor
router.delete("/:name", deleteDoctor);


































module.exports = router;
