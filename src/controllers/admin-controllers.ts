import adminModel from "../models/admin-schema";
import isFieldMissing from "../utils/is-missing-field";
import sendinSignupEmail from "../utils/sending-Signup-email";
import handlePasswordStrength from "../utils/check-password-strength";
import { AvailableTimeModel } from "../models/reservations-utils";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();



// signup admin
export const signupAdmin = async (req: Request, res: Response) => { 
    try {
    const { name, email, phone, password } = req.body;
        const fields = [name, email, phone, password];

    if (isFieldMissing(fields)) {
      return res.status(400).send("All fields are required");
    }

    if (!handlePasswordStrength(res, password)) {
      return;
    }

    const verificationCode = crypto.randomBytes(10).toString("hex");
    const newdoctor = adminModel.create({
      name,
      email,
      phone,
      password,
      verificationCode,
    });
    const type = "admin";
    sendinSignupEmail(res, email, type, name);
  } catch (error) {
    res
      .status(400)
      .json({ message: "degat mtrenjistrach marhh", error: error });
  }
};

//_______________________________________________________________________________________

//login
export const loginAdmin = async (req: Request, res: Response) => {
  const { name, password, rememberMe } = req.body;
  const fields = [name, password];

  if (isFieldMissing(fields)) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await adminModel.findOne({ name });
    if (!user) return res.status(400).send("Invalid email or name");

    const validation = await validatePassword(password, user.password);
    if (!validation) return res.status(400).send("Invalid password");

    const token = await generateToken(user, rememberMe);
    await updateUser(user, token);
    res.json({ message: "Logged in successfully", token: token });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};
//
async function validatePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}
async function generateToken(user: any, rememberMe: boolean) {
  const expiresIn = rememberMe ? "7d" : "1d";
  return await jwt.sign(
    {
      id: user._id,
      type: user.type,
      tokenVersion: user.tokenVersion,
    },
    process.env.secret_key!,
    { expiresIn }
  );
}
async function updateUser(user: any, token: string) {
  user.online = true;
  user.token = token;
  await user.save();
}

//_______________________________________________________________________________________

//get available times for doctors
export const getDoctorsAvailableTimes = async (req: Request, res: Response) => { 
    try {
    const times = await AvailableTimeModel.find();
    res.json(times);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
}

