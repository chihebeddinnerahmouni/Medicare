import express from 'express';
import {
  signupNurse,
  getAllNurses,
  deleteNurse,
} from "../controllers/nurses-controllers";


const router = express.Router();

//get all nurses
router.get("/", getAllNurses);

//delete a nurse
router.delete("/delete/:name", deleteNurse);









module.exports = router;