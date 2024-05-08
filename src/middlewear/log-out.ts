import { verify } from "jsonwebtoken";
import doctormodel from "../models/doctor-schema";
import nurseModel from "../models/nurses-schema";
import patientModel from "../models/patient-schema";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import definingModel from "../utils/defining-model";

export const logout = async (req: Request, res: Response) => {
    try {
        const { id, type, tokenVersion } = req.user;
        const model = await definingModel(type);
        const user = await model!.findById(id);
        if (!user) {
            return res.status(404).send("User not found mlginahch");
        }
        if (user.online === true) {
            if (user.tokenVersion !== tokenVersion) {
                return res.send("token version not matched");
            }
            user.tokenVersion += 1;
            user.tokens = "";
            user.online = false;
            await user.save();
            res.send("logged out");
                          
        } else {
            res.send("user is not online");
        }
    } catch (error) {
        res.status(400).send("degat" + error);
    }
}