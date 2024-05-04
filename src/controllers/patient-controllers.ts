import mongoose from 'mongoose';
import dotenv from 'dotenv';
import patientModel from '../models/patient-schema';
import doctormodel from '../models/doctor-schema';
import nurseModel from '../models/nurses-schema';
import { Request, Response, NextFunction } from 'express';
import { generate6Digits } from '../utils/generate-6-digits';
import bycrypt from 'bcrypt';
import jwt, { sign } from 'jsonwebtoken';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
dotenv.config();
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

const apikey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;


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





