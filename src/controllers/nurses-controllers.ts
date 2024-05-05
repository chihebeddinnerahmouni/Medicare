import { Request, Response, NextFunction } from "express";
import nurseModel from "../models/nurses-schema";
import dotenv from "dotenv";
import crypto from "crypto";
import handlePasswordStrength from "../utils/check-password";
import isFieldMissing from "../utils/is-missing-field";
import handleExistingUser from "../utils/check-execisting-user";
import sendinSignupEmail from "../utils/sending-Signup-email";
dotenv.config();





// Signup nurse
export const signupNurse = async (req: Request, res: Response) => {
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
        const type = "nurse";
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

        sendinSignupEmail(res, email, verificationCode);
    } catch (error) {
        res.status(400).json({ message: "degat mtrenjistrach marhh", error: error });
    }
};

//get all nurses
export const getAllNurses = async (req: Request, res: Response) => {
    try {
        const nurses = await nurseModel.find();
        res.status(200).json(nurses);
    } catch (error) {
        res.status(400).json({ message: "Error getting all nurses", error: error });
    }
};

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
