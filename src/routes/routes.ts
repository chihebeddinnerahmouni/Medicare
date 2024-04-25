import express from "express";
require("dotenv").config();
const jwt = require("jsonwebtoken");
import {
  getAllDoctors,
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  login,
  authenticateToken
} from "../controllers/doctor-controllers";




const router = express.Router();

// get all doctors
router.get("/",authenticateToken ,getAllDoctors);

//create a doctor
router.post("/", createDoctor);

// get one doctor
router.get("/:name", getDoctor);

// update a doctor
router.put("/:name", updateDoctor);

// delete a doctor
router.delete("/:name", deleteDoctor);

// login
router.post("/login", login);











module.exports = router;
