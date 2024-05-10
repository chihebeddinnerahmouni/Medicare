import mongoose from 'mongoose';
import dotenv from 'dotenv';
import patientModel from '../models/patient-schema';
import { Request, Response, NextFunction } from 'express';
import handlePasswordStrength from "../utils/check-password-strength";
import isFieldMissing from "../utils/is-missing-field";
import handleExistingUser from "../utils/check-execisting-user-phemna";
import sendinSignupEmail from "../utils/sending-Signup-email";
import crypto from 'crypto';
import findByEmail from "../utils/find-by-email";
import multer, { StorageEngine } from "multer";
import fs from "fs";
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



// get all patients
export const getAllPatients = async (req: Request, res: Response) => {
    try {
        const patients = await patientModel.find();
        res.status(200).json(patients);
    } catch (error) {
         res.json({ message: 'degat mlginahomch', error: error });
    }
}



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



//get patient profile
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


//update profile picture
export const updatePatientProfilePicture = async (
  req: Request,
  res: Response
) => {
  const user = await patientModel.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Delete the old profile picture if it exists
  if (user.profilePicture) {
    //const oldPicturePath = path.join(__dirname, doctor.profilePicture);
    fs.unlink(user.profilePicture, (err) => {
      if (err) console.error(`Failed to delete old picture at ${user.profilePicture}: `,err);
    });
  }

  user.profilePicture = req.file!.path;

  await user.save();
  res
    .status(200)
    .json({ message: "Profile picture updated successfully", file: req.file! });
};
(error: Error, req: Request, res: Response) => {
  if (error instanceof multer.MulterError) {
    res.status(500).json({ message: "There was an error uploading the file", error: error });
  } else if (error) {
    res.status(500).json({ message: "An unknown error occurred", error: error });
  }
};