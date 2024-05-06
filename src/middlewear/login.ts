import doctormodel from "../models/doctor-schema";
import { Request, Response } from "express";
import nurseModel from "../models/nurses-schema";
import patientModel from "../models/patient-schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isFieldMissing from "../utils/is-missing-field";

export const login = async (req: Request, res: Response) => { 

    const { name, password } = req.body;
    const fields = [name, password];
    
    if (isFieldMissing(fields)) { 
        return res.status(400).send("All fields are required");
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
            const validation = await bcrypt.compare(password, user.password);
            const token = await jwt.sign({ _id: user._id, type: user.type }, process.env.secret_key!);
            if (!validation) {
                return res.status(400).send("Invalid password");
            } else {
                user.online = true;
                user.token = token;
                await user.save();
                res.json({message: "Logged in sahit", token: token});
            }
        }
    } catch (error) { 
        res.status(400).send("degat" + error);
    }










}