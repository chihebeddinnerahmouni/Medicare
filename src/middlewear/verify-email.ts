import doctormodel from "../modules/doctors/doctor-schema";
import patientModel from "../modules/patients/patient-schema";
import nurseModel from "../modules/nurses/nurses-schema";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();




export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    interface UserModel {
        findOne: (arg0: { name: any }) => Promise<any>;
    }

    let model: UserModel;
    const code = req.query.code;
    jwt.verify(code as string, process.env.secret_key!, async (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const type = decoded!.type;
        const name = decoded!.name;
        //check the type of user
        if (type == 'doctor') {
            model = doctormodel;
        } else if (type == 'nurse') {
            model = nurseModel;
        } else if (type == 'patient') {
            model = patientModel;
        }

        //start confirmation
        try {
            const user = await model!.findOne({ name });
            if (!user) return res.status(404).json({ message: "User not found" });
            
            if (user!.verified) return res.status(400).json({ message: "User already verified" });
            
                user!.verified = true;
                user!.verificationCode = undefined;
                await user!.save();
                res.status(200).send(`${user!.name}'s email have been verified`);
            
        } catch (error) {
            res.status(500).json({ message: "degat", err: error });
        }
    });
}

















/*export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const { code } = req.query;

        const doctor = await doctormodel.findOne({ verificationCode: code });
        //if no doctor found
        if (!doctor) {
            res.status(404).json({ message: "Doctor not found" });
        } else
            //if doctor is already verified
            if (doctor!.verified) {
                res.status(400).json({ message: "Doctor already verified" });
            } else {
                //if doctor found and not verified
                try {
                    doctor!.verified = true;
                    doctor!.verificationCode = undefined;
                    await doctor!.save();
                    res.status(200).send(`${doctor!.name}'s email have been verified`);
                } catch (error) {
                    res.status(500).json({ message: "mtverifach", err: error });
                }
            }
    } catch (error) {
        res.status(500).json({ message: "degat", err: error });
    }
}
*/









