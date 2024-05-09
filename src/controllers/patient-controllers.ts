import mongoose from 'mongoose';
import dotenv from 'dotenv';
import patientModel from '../models/patient-schema';
import { Request, Response, NextFunction } from 'express';
import handlePasswordStrength from "../utils/check-password";
import isFieldMissing from "../utils/is-missing-field";
import handleExistingUser from "../utils/check-execisting-user";
import sendinSignupEmail from "../utils/sending-Signup-email";
import crypto from 'crypto';
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
    const type = "patient";
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