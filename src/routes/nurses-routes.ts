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
  refusePatientRequests,
  acceptPatientRequests,
  serviceEnd,
  getRequest,
  statusToNotWork,
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

//delete a patient request
router.put("/profile/refuse-request", authGuard, refusePatientRequests);

//accept a patient request
router.put("/profile/accept-request", authGuard, acceptPatientRequests);

// finish the nurse
router.put("/profile/service-end", authGuard, serviceEnd);

// get request
router.get("/profile/get-request", authGuard, getRequest);

//change status to not working
router.put("/profile/change-not-working", authGuard, statusToNotWork);







module.exports = router;