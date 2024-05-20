import express from 'express';
import {
  signupAdmin,
  loginAdmin,
  getDoctorsAvailableTimes,
} from "../controllers/admin-controllers";


const router = express.Router();

// signup admin
router.post("/signup", signupAdmin);

// login admin
router.post("/login", loginAdmin);

//get all available times
router.get("/doctors-available-times", getDoctorsAvailableTimes);








module.exports = router;