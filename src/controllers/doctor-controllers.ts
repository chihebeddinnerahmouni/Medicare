import { Request, Response, } from "express";
import doctormodel from "../models/doctor-schema";
import dotenv from "dotenv";
import handlePasswordStrength from "../utils/check-password";
import isFieldMissing from "../utils/is-missing-field";
import handleExistingUser from "../utils/check-execisting-user";
import sendinSignupEmail from "../utils/sending-Signup-email";
import AvailableTime from "../utils/availableTime-table";
import jwt from "jsonwebtoken";
import crypto from "crypto"
dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}
//signup
export const signupDoctor = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, location, specialite, password } = req.body;
    const fields = [name, email, phone, location, specialite, password];

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
    const type = "doctor";
    const newdoctor = doctormodel.create({
      name,
      email,
      phone,
      location,
      specialite,
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


//add availabletime
export const AddAvailableTime = async (req: Request, res: Response) => {
  try { 
     const authheader = req.headers.authorization;
    const token = authheader && authheader.split(" ")[1];
    jwt.verify(token!, process.env.secret_key as string, async (err: any, result: any) => { 
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userid = result._id;
      const { day, hour, ticketNumber } = req.body;
      const doctor = await doctormodel.findOne({ _id: userid });
      if (!doctor) {
        return res.status(400).send("Cannot find doctor");
      } else {
        const availableTime = new AvailableTime({
          day,
          hour,
          ticketNumber,
        });
        await availableTime.save();
        doctor!.available.push(availableTime);
        await doctor!.save();
        res.json({
          message: "Available time added",
          doctor: doctor,
        });
      }

    });



  } catch(err) {
    res.send("error"+ err)
  }
}










  /*try {
    const { name } = req.query;
    const { day, hour, ticketNumber } = req.body;
    const doctor = await doctormodel.findOne({ name: name });
    if (!doctor) {
      return res.status(400).send("Cannot find doctor");
    } else {
      const availableTime = new AvailableTime({
        day,
        hour,
        ticketNumber,
      });
      await availableTime.save();
      doctor!.available.push(availableTime);
      await doctor!.save();
      console.log(doctor);
      console.log(availableTime);
      res.json({
        message: "Available time added",
        doctor: doctor,
      });
    }
  } catch (error) {
    res.status(400).send("Cannot add available time");
  }
*/




