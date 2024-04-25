import { Request, Response, } from "express";
import doctormodel from "../models/doctor-schema";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    const doctors = await doctormodel.find();
    res.json(doctors)
  } catch (error) {
    res.status(400).send("Cannot get all doctors");
  }
};

//create a doctor
export const createDoctor = async (req: Request, res: Response) => {
  try {

    const doctorData = req.body;

    const doctor = await doctormodel.create(doctorData);
    res.json(doctor);
  } catch (error) {
    res.status(400).send("Cannot create doctor");
  }
}


// get one doctor
export const getDoctor = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const doctor = await doctormodel.findOne({ name: name });
    res.json(doctor);
  } catch (error) {
    res.status(400).send("Cannot find doctor");
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
    } else {
      const token = await doctor.generateJWT();
      res.json({ message: "Logged in", token: token });
    }
  } catch (error) {
    res.status(400).send("Cannot login");
  }
}


// authenticate token
export const authenticateToken = (req: Request, res: Response, next: any) => { 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.secret_key, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user; 
    next();
  });
}


