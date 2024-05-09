import doctormodel from "../models/doctor-schema";
import { Request, Response } from "express";
import nurseModel from "../models/nurses-schema";
import patientModel from "../models/patient-schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isFieldMissing from "../utils/is-missing-field";

export const login = async (req: Request, res: Response) => {
    const { name, password, rememberMe } = req.body;
    const fields = [name, password];
    
    if (isFieldMissing(fields)) {
        return res.status(400).send("All fields are required");
    }

    try {
        const user = await findUser(name);
        if (!user) return res.status(400).send("Invalid email or name");
        
        //if (!user.verified) return res.status(400).send(`${user.name}'s email not verified, verify`);
        
        const validation = await validatePassword(password, user.password);
        if (!validation) return res.status(400).send("Invalid password");
         
        if (user.online) return res.status(400).send("User already logged in");

        const token = await generateToken(user, rememberMe);
        //const refreshToken = await generateRefreshToken(user);
            await updateUser(user, token);
            res.json({ message: "Logged in successfully", token: token });
        
    } catch (error) {
        res.status(400).send("Error: " + error);
    }
}








async function findUser(name: string) {
    const [doctor, patient, nurse] = await Promise.all([
        doctormodel.findOne({ name }),
        patientModel.findOne({ name }),
        nurseModel.findOne({ name }),
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






