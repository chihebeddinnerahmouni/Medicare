import express from "express";
import {
  deletePatient,
  getPatientProfile,
  resetPassword,
  updatePatientProfile,
  updatePatientEmail,
  updatePassword,
  updatePatientProfilePicture,
  updatePatientCoverPicture,
  deleteAllRequests,
  sendReservationRequest,
  reserveScheduleTicket,
  deleteAllScheduleReservations,
  getNearbyNurses,
  resetPatient,
  rateNurse,
  chooseNurse,
  refuseNurse,
} from "../controllers/patient-controllers";
import authGuard from "../middlewear/authGuard";
import adminAuthGuard from "../middlewear/admin-authGuard";
import upload from "../utils/multer-configs-to-images";


const router = express.Router();


//delete a patient
router.delete("/:name", deletePatient);

//patient profile
router.get("/profile", authGuard, getPatientProfile);

//reset password
router.put("/profile/reset-password", authGuard, resetPassword);

//update profile
router.put("/profile/update-profile", authGuard, updatePatientProfile);

//update email
router.put("/profile/update-email", authGuard, updatePatientEmail);

//update password
router.put("/profile/update-password", authGuard, updatePassword);

//update profile pic
router.put("/profile/update-profile-picture", upload.single("PatProfPic"), authGuard, updatePatientProfilePicture)

//update cover pic
router.put("/profile/update-cover-picture", upload.single("PatCoverPic"), authGuard, updatePatientCoverPicture)

//delete all requests (doctors)
router.put("/profile/delete-requests", authGuard, deleteAllRequests)

//reservation request (doctors)
router.put("/profile/send-reservation-request", authGuard, sendReservationRequest);

//reserve a schedule ticket (doctors)
router.put("/profile/reserve-ticket", authGuard, reserveScheduleTicket);

//delete all schedule reservations (doctors)
router.put("/profile/delete-schedule-reservations", authGuard, deleteAllScheduleReservations);

//look for nearby nurses
router.post("/profile/nearby-nurses", authGuard, getNearbyNurses);

//reset patient
router.put("/profile/reset-patient", authGuard, resetPatient);

// rate a nurse
router.put("/profile/rate-nurse", authGuard, rateNurse);

//refuse accepted nurse
router.put("/profile/refuse-nurse", authGuard, refuseNurse);

//choose another nurse
router.put("/profile/choose-nurse", authGuard, chooseNurse);






module.exports = router;