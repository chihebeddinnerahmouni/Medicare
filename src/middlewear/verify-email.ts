import doctormodel from "../models/doctor-schema";
import patientModel from "../models/patient-schema";
import nurseModel from "../models/nurses-schema";
import { Request, Response, NextFunction } from "express";

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    interface UserModel {
      findOne: (arg0: { verificationCode: any }) => Promise<any>;
    }

    let model: UserModel;
    const { type } = req.query;
    const { code } = req.query;
    //check the type of user
    if (type == 'doctor') {
        model = doctormodel;
        //const user = 'doctor';
    } else if (type == 'nurse') {
        model = nurseModel;
        //const user = 'nurse';
    } else if (type == 'patient') {
        model = patientModel;
        //const user = 'patient';
    }

    //start confirmation
    try {
        const user = await model!.findOne({ verificationCode: code });
        if (!user) {
            res.status(404).json({ message: "User not found" });
        } else if (user!.verified) {
            res.status(400).json({ message: "User already verified" });
        } else { 
            user!.verified = true;
            user!.verificationCode = undefined;
            await user!.save();
            res.status(200).send(`${user!.name}'s email have been verified`);
        }
    } catch (error) { 
        res.status(500).json({ message: "degat", err: error });
    }
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









