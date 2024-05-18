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
import { IRequest } from '../models/availableTime-table';
import doctormodel from '../models/doctor-schema';
import AvailableTimeModel from '../models/availableTime-table';

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
    user.reservationsRequests = [];

    await user.save();
    res.json({ message: "All requests deleted" });
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

    patient.reservationsRequests.push(availableTimeInDoctor)
    await patient.save();

    const patientInfos: IRequest = {
      name: patient.name,
      profilePicture: patient.profilePicture,
      phone: patient.phone
    }

      availableTimeInDoctor.requestList.push(patientInfos);
      await doctor.save();

      const availableTime = await AvailableTimeModel.findOne({ code });
      if (!availableTime) return res.status(400).send("Cannot find available time to reserve");
      availableTime.requestList.push(patientInfos);
      availableTime.reserved = "pending";
      await availableTime.save();

     

    res.json({ message: "Request sent succesfully please wait doctor to accept" });
  } catch (error) {
    res.status(400).send("Cannot send reservation request: " + error);
  }
}