import mongoose from 'mongoose';
import dotenv from 'dotenv';
import patientModel from "../models/patient-schema";
import { Request, Response } from 'express';
import handlePasswordStrength from "../utils/check-password-strength";
import isFieldMissing from "../utils/is-missing-field";
import handleExistingUser from "../utils/check-execisting-user-phemna";
import sendinSignupEmail from "../utils/sending-Signup-email";
import crypto from 'crypto';
import findByEmail from "../utils/find-by-email";
import fs from "fs";
import {
  IRequest,
  IReservationRequests,
  //reservationRequestsModel,
  //AvailableTimeModel,
  IPatientScheduleReservation,
} from "../models/reservations-utils";
import doctormodel from '../models/doctor-schema';
import nurseModel from '../models/nurses-schema';


dotenv.config();
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

//signup
export const signupPatient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    const fields = [name, email, phone, password];
    const type = "patient";
    if (isFieldMissing(fields)) {
      return res.status(400).send("All fields are required");
    }

    if (!handlePasswordStrength(res, password)) {
      return;
    }

    if (await handleExistingUser(res, email, name, phone)) {
      return;
    }

    const verificationCode = crypto.randomBytes(10).toString("hex");
    const nurse = patientModel.create({
      name,
      email,
      phone,
      password,
      type,
      verificationCode,
    });
    sendinSignupEmail(res, email, type, name);
  } catch (error) {
    res
      .status(400)
      .json({ message: "degat mtrenjistrach marhh", error: error });
  }
};


//______________________________________________________________________________________


// get all patients
export const getAllPatients = async (req: Request, res: Response) => {
  try {
        const patients = await patientModel.find();
        res.status(200).json(patients);
    } catch (error) {
         res.json({ message: 'degat mlginahomch', error: error });
    }
}


//______________________________________________________________________________________


//delete a patient
export const deletePatient = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;
        await patientModel.findOneAndDelete({ name: name });
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.json({ message: 'degat matssuprimach', error: error });
    }
}


//______________________________________________________________________________________


//get profile
export const getPatientProfile = async (req: Request, res: Response) => { 
  try {
    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find nurse profile");
      const resUser = {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    res.json(resUser);
  } catch (error) { 
    res.send("error degat"+ error)
  }
};


//______________________________________________________________________________________


//update password
export const updatePassword = async (req: Request, res: Response) => { 
  try {
    const id = req.user.id;
    const { password } = req.body;
    if (!handlePasswordStrength(res, password)) return;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to reset password");
    user.password = password;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (error) {
    res.send("error degat"+ error)
  }
};


//______________________________________________________________________________________


//update profile
export const updatePatientProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { name, email, phone } = req.body;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find Patient to update profile");

    if (await handleExistingUser(res, email, name, phone)) return;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.send("error" + err);
  }
};


//______________________________________________________________________________________


//update email
export const updatePatientEmail = async (req: Request, res: Response) => { 

  try {
    const id = req.user.id;
    const { email, phone, name } = req.body;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to update email");

    const exdoctorexuser = await patientModel.findOne({ email });
    if(await findByEmail(res, email)) return;
    //if (await handleExistingUser(res, email, name, phone)) return;

    await sendinSignupEmail(res, email, user.type, user.name);
    
    user.verified = false;
    user.email = email;
    await user.save();
  } catch (err) {
    res.send("error" + err);
  }
}


//______________________________________________________________________________________


//update profile picture
export const updatePatientProfilePicture = (req: Request, res: Response) => updatePicture(req, res, "profilePicture");

//update cover picture
export const updatePatientCoverPicture = (req: Request, res: Response) => updatePicture(req, res, "coverPicture");

//helper function to update picture
async function updatePicture(
  req: Request,
  res: Response,
  pictureField: "profilePicture" | "coverPicture"
) {
  const user = await patientModel.findById(req.user.id);
  if (!user) return res.status(404).json({ message: `User not found` });

  if (user[pictureField]) {
    fs.unlink(user[pictureField], (err) => {
      if (err)
        console.error(
          `Failed to delete old picture at ${user[pictureField]}: `,
          err
        );
    });
  }

  user[pictureField] = req.file!.path;
  await user.save();
  res
    .status(200)
    .json({ message: `${pictureField} updated successfully`, file: req.file! });
}

//______________________________________________________________________________________


//delete all requests
export const deleteAllRequests = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to delete requests");

// delete from patient
    user.reservationsRequests = [];
    await user.save();

//delete from doctor
   const name = user.name;
   await doctormodel.updateMany(
     {},
     { $pull: { "available.$[].requestList": { name } } }
    );
    
//delete from reservationRequests
    /*await reservationRequestsModel.deleteMany({
      patient: name
    });*/

    //delete from availableTime
    /*await AvailableTimeModel.updateMany(
      {},
      { $pull: { requestList: { name } } }
    );*/

    res.json({ message: `All requests deleted, thank you ${user.name}` });
  } catch (error) {
    res.send("error deleting all requests" + error);
  }
}

//______________________________________________________________________________________


//reservation
export const sendReservationRequest = async (req: Request, res: Response) => {

  try {
    const { doctorName, code } = req.body;

    const id = req.user.id;

    const doctor = await doctormodel.findOne({ name: doctorName });
    if (!doctor) return res.status(400).send("Cannot find doctor to reserve");
    const patient = await patientModel.findById(id);
    if (!patient) return res.status(400).send("Cannot find patient to reserve");
    const availableTimeInDoctor = doctor.available.find((time: any) => time.code === code);
    if (!availableTimeInDoctor) return res.status(400).send("Cannot find available time in doctor to reserve");

    if (availableTimeInDoctor.reserved === "reserved") return res.status(400).send("This time is already reserved");

    availableTimeInDoctor.reserved = "pending";
//save in patient
    const rdvInPatient = {
      day: availableTimeInDoctor.day,
      hour: availableTimeInDoctor.hour,
      ticketNumber: availableTimeInDoctor.ticketNumber,
      reserved: "pending",
      code: availableTimeInDoctor.code,
      doctor: doctorName,
      patient: patient.name
    } as IReservationRequests;
    patient.reservationsRequests.push(rdvInPatient);
    await patient.save();

    //save in reservationRequests
    /*const reservationRequest = new reservationRequestsModel(rdvInPatient);
    await reservationRequest.save();*/

    


//save in doctor
    const patientInfos: IRequest = {
      name: patient.name,
      profilePicture: patient.profilePicture,
      phone: patient.phone
    }
      availableTimeInDoctor.requestList.push(patientInfos);
      await doctor.save();

      //save in availableTime
      /*const availableTime = await AvailableTimeModel.findOne({ code });
      if (!availableTime) return res.status(400).send("Cannot find available time to reserve");
      availableTime.requestList.push(patientInfos);
      availableTime.reserved = "pending";
      await availableTime.save();*/

     

    res.json({ message: `Request sent succesfully please wait doctor to accept, thank you ${patient.name}` });
  } catch (error) {
    res.status(400).send("Cannot send reservation request: " + error);
  }
}

//______________________________________________________________________________________

//reserve schedule ticket
export const reserveScheduleTicket = async (req: Request, res: Response) => {
  try {
    const { doctor, day } = req.body;
    const id = req.user.id;
    const fields = [doctor, day];

    if (isFieldMissing(fields)) return res.status(400).send("All fields are required");
    
    const patient = await patientModel.findById(id);
    if (!patient) return res.status(400).send("Cannot find patient to reserve schedule ticket");
    const doctorr = await doctormodel.findOne({ name: doctor });
    if (!doctorr) return res.status(400).send("Cannot find doctor to reserve schedule ticket");

    let schedule = doctorr.schedule.find((time: any) => time.day === day);
    if (!schedule) return res.status(400).send("Cannot find schedule to reserve schedule ticket");

    let freeSlot = schedule.freeAt.find((slot: any) => slot.reserved === "free");
    if (!freeSlot) return res.status(400).send("Cannot find free slot to reserve schedule ticket");

    freeSlot.reserved = "true";
    freeSlot.patient = patient.name;
    await doctorr.save();

    const scheduleReservation: IPatientScheduleReservation = {
      day: schedule.day,
      hour: freeSlot.hour,
      ticketNumber: freeSlot.ticketNumber,
      doctor: doctorr.name,
      location: doctorr.location,
      phone: doctorr.phone,
      reservedAt: new Date().getDay() + "/" + new Date().getMonth() + "," + new Date().getHours() + ":" + new Date().getMinutes(),
    };
    patient.scheduleResevations.push(scheduleReservation);
    await patient.save();

    res.json({ message: `your ticket number is  ${freeSlot.ticketNumber}, thank you ${patient.name}` });
    
  } catch (error) {
    res.status(400).send("Cannot reserve schedule ticket: " + error);
  }
}

//_____________________________________________________________________________________

//delete all schedule reservations
export const deleteAllScheduleReservations = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to delete schedule reservations");

    user.scheduleResevations = [];
    await user.save();

await doctormodel.updateMany(
  { "schedule.freeAt.patient": user.name },
  { $set: { "schedule.$[].freeAt.$[slot].reserved": "free", "schedule.$[].freeAt.$[slot].patient": "" } },
  { arrayFilters: [{ "slot.patient": user.name }] }
);
      
    
    res.json({ message: `All schedule reservations deleted, thank you ${user.name}` });
  } catch (error) {
    res.status(400).send("Cannot delete all schedule reservations: " + error);
  }
}

//_____________________________________________________________________________________

//get neaby nurses
export const getNearbyNurses = async (req: Request, res: Response) => {
  try {
    const userLocation = req.body.userLocation;

    const nearbyNurses = await nurseModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: userLocation
          },
          $maxDistance: 1000 //in meters
        }
      }
    });
     res.status(200).json(nearbyNurses);
  } catch (error) {
    res.status(400).send("Cannot get nearby nurses: " + error);
  }
}









