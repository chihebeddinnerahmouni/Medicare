import { Request, Response } from "express";
import doctormodel from "./doctor-schema";
import patientModel from "../patients/patient-schema";
import dotenv from "dotenv";
import handlePasswordStrength from "../../utils/check-password-strength";
import isFieldMissing from "../../utils/is-missing-field";
import handleExistingUser from "../../utils/check-execisting-user-phemna";
import sendinSignupEmail from "../../utils/sending-Signup-email";
import AvailableTimeModel from "../../models/availableTime-schema";
import { reservationRequestsModel } from "../../models/requests-models";
import crypto from "crypto";
import  findByEmail  from "../../utils/find-by-email";
import { generate6Digits } from "../../utils/generate-6-digits";
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
export const signupDoctor = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, location, specialite, password } = req.body;
    const fields = [name, email, phone, location, specialite, password];
        const type = "doctor";

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

//______________________________________________________________________________________


//get all doctors
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await doctormodel.find();
    //.select("name specialite phone location available");
    res.json(doctors);
  } catch (error) {
    res.status(400).send("degat");
  }
};


//______________________________________________________________________________________



// delete a doctor
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const doctor = await doctormodel.findOneAndDelete({ name: name });
    res.json({ message: "doctor deleted" });
  } catch (error) {
    res.status(400).send("Cannot delete doctor");
  }
};


//______________________________________________________________________________________


//add availabletime
export const AddAvailableTime = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const user = await doctormodel.findById(id);
    if (!user) return res.status(400).send("Cannot find user to add available time");

    const { day, hour, ticketNumber } = req.body;
    const code = await generate6Digits();
    const doctor = user.name;
    const reserved = "free";
    
    const availableTime = new AvailableTimeModel({
        day,
        hour,
        ticketNumber,
        code,
        doctor,
        reserved
    });
          await availableTime.save();
          user!.available.push(availableTime);
          await user!.save();
          res.json({
            message: "Available time added",
            doctor: user,
          });
  } catch (err) {
    res.send("degat error" + err);
  }
};


//______________________________________________________________________________________

//get profile
export const getDoctorProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const doctor = await doctormodel.findById(id);
    if (!doctor) return res.status(345).send("Cannot find doctor profile");
    const resDoctor = {
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      location: doctor.location,
      specialite: doctor.specialite,
    };
    res.json(resDoctor);
  } catch (error) {
    res.send("error degat" + error);
  }
};


//______________________________________________________________________________________


//update password
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { password } = req.body;
    if (!handlePasswordStrength(res, password)) return;
    const user = await doctormodel.findById(id);
    if (!user)
      return res.status(400).send("Cannot find doctor to reset password");
    user.password = password;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (error) {
    res.send("error degat" + error);
  }
};


//______________________________________________________________________________________


//update profile
export const updateDoctorProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const field = req.body;
    const { email } = req.body;
    let name: any;
    let phone: any;
    const user = await doctormodel.findById(id);
    if (!user) return res.status(400).send("Cannot find doctor to update profile");

    if (await handleExistingUser(res, email, name, phone)) return;
    
    updateUserFields(user, field);


    await user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.send("error" + err);
  }
};
const updateUserFields = (user: any, fields: any) => { // teb3a l update profile
  const { name, email, phone, location, specialite } = fields;
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (location) user.location = location;
  if (specialite) user.specialite = specialite;
};


//______________________________________________________________________________________


//update email
export const updateDoctorEmail = async (req: Request, res: Response) => { 

  try {
    const id = req.user.id;
    const { email, phone, name } = req.body;
    const user = await doctormodel.findById(id);
    if (!user) return res.status(400).send("Cannot find doctor to update email");

    const exdoctor = await doctormodel.findOne({ email });
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
export const updateDoctorProfilePicture = (req: Request, res: Response) => updatePicture(req, res, "profilePicture");

//update cover picture
export const updateDoctorCoverPicture = (req: Request, res: Response) => updatePicture(req, res, "coverPicture");

//helper function to update picture
async function updatePicture(
  req: Request,
  res: Response,
  pictureField: "profilePicture" | "coverPicture"
) {
  const user = await doctormodel.findById(req.user.id);
  if (!user) return res.status(404).json({ message: `User not found` });

  if (user[pictureField]) {
    fs.unlink(user[pictureField], (err) => {
      if (err) console.error(`Failed to delete old picture at ${user[pictureField]}: `,err);
    });
  }

  user[pictureField] = req.file!.path;
  await user.save();
  res
    .status(200)
    .json({ message: `${pictureField} updated successfully`, file: req.file! });
}

//______________________________________________________________________________________


export const searchDoctor = async (req: Request, res: Response) => {
  try {
    const { name } = req.query; // Get the search query from the request
    const doctors = await doctormodel.find({ name: { $regex: `^${name}`, $options: "i" }, });
    if (doctors.length === 0) return res.status(404).json({ message: "No doctor found" });
    return res.json(doctors);
  } catch (error) {
    res.status(500).json({message: "An error occurred while searching for doctors",error: error,});
  }
};

//______________________________________________________________________________________

// delete all available times
export const deleteAllAvailableTimes = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const user = await doctormodel.findById(id);
    if (!user) return res.status(400).send("Cannot find user to delete available times");
    user.available = [];
    await user.save();
    await AvailableTimeModel.deleteMany({ doctor: user.name /*, reserved: "free"*/});
    res.json({ message: "all Available times deleted" });
  } catch (error) {
    res.status(400).send("Cannot delete available times" + error);
  }
}

//______________________________________________________________________________________


//confirm reservation
export const confirmReservation = async (req: Request, res: Response) => {
  try {
    const { code, patientName } = req.body;

    const patient = await patientModel.findOne({ name: patientName });
    const doctor = await doctormodel.findById(req.user.id);
    const availableTime = await AvailableTimeModel.findOne({ code });
    const rdvInDoctor = doctor!.available.find((time: any) => time.code === code);
    const rdvInPatient = patient!.reservationsRequests.find((time: any) => time.code === code);
    if (!patient) return res.status(400).send("Cannot find patient");
    if (!doctor) return res.status(400).send("Cannot find doctor");
    if (!availableTime) return res.status(400).send("Cannot find available time");
    if (availableTime.reserved === "reserved") return res.status(400).send("This time is already reserved");

    availableTime.reserved = "reserved";
    availableTime.patient = patientName;
    availableTime.requestList = [];
    await availableTime.save();

    rdvInDoctor!.reserved = "reserved";
    rdvInDoctor!.patient = patientName;
    rdvInDoctor!.requestList = [];
    await doctor.save();

    rdvInPatient!.reserved = "reserved";
    //rdvInPatient!.requestList = [];
    await patient.save();

    res.json({ message: `Reservation confirmed to ${patient.name}` });
  } catch (error) {
    res.status(400).send("Cannot confirm reservation" + error);
  }
}