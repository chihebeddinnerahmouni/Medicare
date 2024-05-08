import express from 'express';
import {
  getAllNurses,
  deleteNurse,
  getNurseProfile
} from "../controllers/nurses-controllers";
import { authGuard } from "../middlewear/authGuard";


const router = express.Router();

//get all nurses
router.get("/", getAllNurses);

//delete a nurse
router.delete("/delete/:name", deleteNurse);

//nurse profile
router.get("/profile", authGuard, getNurseProfile);









module.exports = router;