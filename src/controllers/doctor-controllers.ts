import { Request, Response, } from "express";
import doctormodel from "../models/doctor-schema";
import patientModel from "../models/patient-schema";
import nurseModel from "../models/nurses-schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { generate6Digits } from "../utils/generate-6-digits";
dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}


//get all doctors
export const getAllDoctors = async (req: Request, res: Response) => {
    try {
      const doctors = await doctormodel
        .find()
        //.select("name specialite phone location available");
      res.json(doctors)
  } catch (error) {
    res.status(400).send("degat");
  }
};










// get one doctor
export const getDoctor = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const doctor = await doctormodel.findOne({ name: name });
    if (!doctor) {
      return res.status(400).send("Cannot find doctor");
    } else {
      const doctorData = {
        name: doctor!.name,
        specialite: doctor!.specialite,
        phone: doctor!.phone,
        location: doctor!.location,
        available: doctor!.available
      };
      res.json(doctorData);
    }
  } catch (error) {
    res.status(400).send("degat");
  }
};

// update a doctor
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const updatedDoctor = await doctormodel.findOneAndUpdate({ name: name }, req.body,{ new: true });
    res.json({
      message: "Doctor updated",
      doctor: updatedDoctor,
    });
  } catch (error) {
    res.status(400).send("Cannot update doctor");
  }
}

// delete a doctor
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
  const name = req.params.name;
  const doctor = await doctormodel.findOneAndDelete({ name: name });
    res.json({ message: "doctor deleted" });
  } catch (error) {
    res.status(400).send("Cannot delete doctor");
  }
}


// authenticate token
export const authenticateToken = (req: Request, res: Response, next: any) => { 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.secret_key!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user; 
    next();
  });
}


