import doctormodel from "../models/doctor-schema";
import { Request, Response } from "express";
import nurseModel from "../models/nurses-schema";
import patientModel from "../models/patient-schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isFieldMissing from "../utils/is-missing-field";

export const login = async (req: Request, res: Response) => {
    const { identifier, password, rememberMe } = req.body;
    const fields = [identifier, password];
    
    if (isFieldMissing(fields)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await findUser(identifier);
        if (!user) return res.status(400).json({ message: "invalid name/email or password, please check your informations and try again" });
        
        const validation = await validatePassword(password, user!.password);
        if (!validation) return res.status(400).json({ message:"invalid name/email or password, please check your informations and try again",});
      
      //if (!user || !validation) return res.status(400).json({ message: "Invalid name or password" });

        const token = await generateToken(user, rememberMe);
        //const refreshToken = await generateRefreshToken(user);
            await updateUser(user, token);
            res.status(200).json({ message: "Logged in successfully", token: token });
        
    } catch (error) {
      res.status(400).send("Error: " + error);
    }
}








async function findUser(identifier: string) {
    const [doctor, patient, nurse] = await Promise.all([
      doctormodel.findOne({ $or: [{ name: identifier }, {email: identifier }] }),
      patientModel.findOne({
        $or: [{ name: identifier }, {email: identifier }],
      }),
      nurseModel.findOne({ $or: [{ name: identifier }, {email: identifier }] }),
    ]);
    return doctor || patient || nurse;
}

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
async function generateRefreshToken(user: any) {
  return await jwt.sign(
    {
      id: user._id,
      type: user.type,
      tokenVersion: user.tokenVersion,
    },
    process.env.refresh_secret_key!,
    { expiresIn: "7d" }
  );
}

async function updateUser(user: any, token: string) {
    user.online = true;
    user.token = token;
    await user.save();
}






