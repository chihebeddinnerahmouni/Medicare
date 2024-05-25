import express from 'express';
import {
  getAllNurses,
  deleteNurse,
  getNurseProfile,
  updatePassword,
  updateNurseProfile,
  updateNurseEmail,
  updateNurseProfilePicture,
  updateNurseCoverPicture,
  statusToWork,
} from "../controllers/nurses-controllers";
import authGuard from "../middlewear/authGuard";
import upload from "../utils/multer-configs-to-images";


const router = express.Router();

//get all nurses
router.get("/", getAllNurses);

//delete a nurse
router.delete("/delete", deleteNurse);

//nurse profile
router.get("/profile", authGuard, getNurseProfile);

//update password
router.put("/profile/update-password", authGuard, updatePassword);

//update profile
router.put("/profile/update-profile", authGuard, updateNurseProfile);

//update email
router.put("/profile/update-email", authGuard, updateNurseEmail);

//update profile pic
router.put("/profile/update-profile-picture", upload.single("NurProfPic"), authGuard, updateNurseProfilePicture)

//update cover pic
router.put("/profile/update-cover-picture", upload.single("NurCoverPic"), authGuard, updateNurseCoverPicture)

//change on work status 
router.put("/profile/change-work-status", authGuard, statusToWork);







module.exports = router;