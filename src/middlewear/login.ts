import doctormodel from "../models/doctor-schema";
import { Request, Response } from "express";
import nurseModel from "../models/nurses-schema";
import patientModel from "../models/patient-schema";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => { 

    const { name, password } = req.body;
    const isFieldMissing = !name || !password;
    if (isFieldMissing) {
      return res.status(400).send("Please fill all fields");
    }
    try {
        const [doctor, patient, nurse] = await Promise.all([
            doctormodel.findOne({ name }),
            patientModel.findOne({ name }),
            nurseModel.findOne({ name }),
        ]);
        const user = doctor || patient || nurse;
        if (!user) {
            return res.status(400).send("User not found");
        } else { 
            const validation = await bycrypt.compare(password, user.password);
            const token = await jwt.sign({ _id: user._id }, process.env.secret_key!);
            if (!validation) {
                return res.status(400).send("Invalid password");
            } else {
                res.json({message: "Logged in sahit", token: token});
            }
        }

        




    } catch (error) { 
        res.status(400).send("degat" + error);
    }










}