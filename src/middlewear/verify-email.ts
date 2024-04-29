import doctormodel from "../models/doctor-schema";
import e, { Request, Response, NextFunction } from "express";

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    
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










