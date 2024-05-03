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

//signup a patient
export const signupPatient = async (req: Request, res: Response) => { 
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({ username: 'api', key: apikey! });
    try {
        const { name, email, phone, password, type} = req.body;
        const isFieldMissing = !name || !email || !phone || !password || !type;
        if (isFieldMissing) {
          return res.status(400).send("Please fill all fields");
        }

        //Password must contain at least one lowercase letter, one uppercase letter, one number
        const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password);
        if (!passwordRegex || password.length < 8) {
          return res.status(401).send("Password must contain at least one lowercase letter, one uppercase letter, one number and at least 8 characters long");
        }

        //check if user already exists
            const [exestingDoctor, exictingPatient, existingNurse] =
              await Promise.all([
                doctormodel.findOne({ $or: [{ email }, { name }] }),
                patientModel.findOne({ $or: [{ email }, { name }] }),
                nurseModel.findOne({ $or: [{ email }, { name }] }),
              ]);
            const existingUser =
              exestingDoctor || exictingPatient || existingNurse;
            if (existingUser) {
              return res.status(403).send("User already exists");
            }

        //create a new patient
        const patient = await patientModel.create({
            name,
            email,
            phone,
            password,
            type
        });

        const verificationCode = generate6Digits();
        patient.verificationCode = verificationCode;
        await patient.save();

        //send email
        try {
            const verificationLink = `localhost:3000/patients/verify/?code=${verificationCode}&type=patient`
            const emaildata = {
                from: `hna <mailgun@${domain}>`,
                to: email,
                subject: 'Verification Code',
                text: `Verification code: ${verificationLink}`
            }
            await client.messages.create(domain!, emaildata);
            const token = jwt.sign(
              { name: patient.name },
              process.env.secret_key!
            );
            res.status(200).json({ message: "created and email sent succesfully", token: token });
        } catch (error) {
            res.status(400).json({ message: 'verification email not send', error: error });
        }


    } catch (error) {
        res.status(400).json({ message: 'degat mtrenjistrach', error: error });
    }
}




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





