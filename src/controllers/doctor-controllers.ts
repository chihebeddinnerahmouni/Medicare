import { Request, Response, } from "express";
import doctormodel from "../models/doctor-schema";
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
    try {
      const doctors = await doctormodel
        .find()
        .select("name specialite phone location available");
      res.json(doctors)
    } catch (error) { 
      res.status(400).send("Cannot get all doctors");
    }
  } catch (error) {
    res.status(400).send("degat");
  }
};

//signup a doctor
export const createDoctor = async (req: Request, res: Response) => {
  const API_KEY = process.env.MAILGUN_API_KEY;
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: "api", key: API_KEY! });
  try {
    const {
      name,
      specialite,
      phone,
      password,
      email,
      location,
      availableTime,
    } = req.body;
    if (!name || !specialite || !phone || !password || !email || !location) {
      return res.status(400).send("Please fill all fields");
    }
    //Password must contain at least one lowercase letter, one uppercase letter, one number
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password);
    if (!passwordRegex || password.length < 8) {
      return res.status(401).send("Password must contain at least one lowercase letter, one uppercase letter, one number and at least 8 characters long");
    }
    //check if doctor already exists
    const existingUser = await doctormodel.findOne({
      $or: [{ email }, { name }],
    });
    if (existingUser) {
      return res.status(403).send("User already exists");
    }
    //create new doctor
    const newDoctor = new doctormodel({
      name,
      specialite,
      phone,
      password,
      email,
      location,
      availableTime,
    });
    const verificationCode = generate6Digits();
    newDoctor.verificationCode = verificationCode!;
    await newDoctor.save();
    //send email
    const verificationLink = `localhost:5000/doctors/verify?code=${verificationCode}`;
    const messageData = {
      from: `hna  <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: "Account Verification",
      text: `Click the following link to verify your account: ${verificationLink}`,
    };
    const token = jwt.sign({ id: newDoctor._id }, process.env.secret_key!);
    //sending email
    await client.messages.create(DOMAIN!, messageData)
      .then((message: any) => {
        console.log("sent succes");
        const sanitizedUser = {
          _id: newDoctor._id,
          email: newDoctor.email,
          phone: newDoctor.phone,
          verified: newDoctor.verified,
        };
        return res.status(201).json({
          user: sanitizedUser,
          token,
          message:
            "Registration successful. Please check your email for verification instructions.",
        });
      }).catch((error: any) => { res.status(400).send("mtrengistrach") });
  } catch (error) {
    res.status(400).json({error: error, message: "Cannot create doctor" });
  }
}










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

// login
export const login = async (req: Request, res: Response) => {
  try {
    const docname = req.body.name;
    const password = req.body.password;
    const doctor = await doctormodel.findOne({ name: docname });
    if (!doctor) {
      return res.status(400).send("Cannot find user");
    }
    const validation = await bcrypt.compare(password, doctor.password);
    if (!validation) {
      return res.status(400).send("Invalid password");
    }
    res.send("Logged in sahit");
  } catch (error) {
    res.status(400).send("Cannot login");
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


