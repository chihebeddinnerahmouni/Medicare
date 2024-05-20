import { Request, Response } from "express";
import nurseModel from "./nurses-schema";
import dotenv from "dotenv";
import crypto from "crypto";
import handlePasswordStrength from "../../utils/check-password-strength";
import isFieldMissing from "../../utils/is-missing-field";
import handleExistingUser from "../../utils/check-execisting-user-phemna";
import sendinSignupEmail from "../../utils/sending-Signup-email";
import findByEmail from "../../utils/find-by-email";
import fs from "fs";
import patientModel from "../patients/patient-schema";
dotenv.config();





// Signup nurse
export const signupNurse = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, location, specialite, password } = req.body;
      const fields = [name, email, phone, location, specialite, password];
              const type = "nurse";

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
        const nurse = nurseModel.create({
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
        res.status(400).json({ message: "degat mtrenjistrach marhh", error: error });
    }
};

//______________________________________________________________________________________


//get all nurses
export const getAllNurses = async (req: Request, res: Response) => {
    try {
        const nurses = await nurseModel.find();
        res.status(200).json(nurses);
    } catch (error) {
        res.status(400).json({ message: "Error getting all nurses", error: error });
    }
};


//______________________________________________________________________________________


//delete a nurse
export const deleteNurse = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;
        const nurse = await nurseModel.findOneAndDelete({ name });
        res.status(200).send(nurse);
    } catch (error) {
        res.status(400).json({ message: "Error deleting nurse", error: error });
    }
};


//______________________________________________________________________________________


//get profile
export const getNurseProfile = async (req: Request, res: Response) => { 
  try {
    const id = req.user.id;
    const user = await nurseModel.findById(id);
    if (!user) return res.status(400).send("Cannot find nurse profile");
      const resUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        specialite: user.specialite
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
    const user = await nurseModel.findById(id);
    if (!user) return res.status(400).send("Cannot find nurse to reset password");
    user.password = password;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (error) {
    res.send("error degat"+ error)
  }
};


//______________________________________________________________________________________


//update profile
export const updateNurseProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const field = req.body;
    const { email } = req.body;
    let name: any;
    let phone: any;
    const user = await nurseModel.findById(id);
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
export const updateNurseEmail = async (req: Request, res: Response) => { 

  try {
    const id = req.user.id;
    const { email, phone, name } = req.body;
    const user = await nurseModel.findById(id);
    if (!user) return res.status(400).send("Cannot find nurse to update email");

    const exdoctorexuser = await nurseModel.findOne({ email });
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
export const updateNurseProfilePicture = (req: Request, res: Response) => updatePicture(req, res, "profilePicture");

//update cover picture
export const updateNurseCoverPicture = (req: Request, res: Response) => updatePicture(req, res, "coverPicture");

//helper function to update picture
async function updatePicture(
  req: Request,
  res: Response,
  pictureField: "profilePicture" | "coverPicture"
) {
  const user = await nurseModel.findById(req.user.id);
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

export const searchPatient = async (req: Request, res: Response) => {
  try {
    const { name } = req.query; // Get the search query from the request
    const doctors = await patientModel.find({name: { $regex: `^${name}`, $options: "i" }});
    if (doctors.length === 0) return res.status(404).json({ message: "No doctor found" });
    return res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while searching for doctors", error: error, });
  }
};