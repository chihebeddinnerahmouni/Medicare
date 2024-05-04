import { Request, Response,NextFunction } from "express";
import dotenv from "dotenv";
import doctormodel from "../models/doctor-schema";
import nurseModel from "../models/nurses-schema";
import patientModel from "../models/patient-schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
dotenv.config();


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  let code: any;
  const { id } = req.params;
  const { password } = req.body;

  try {
    const [doctor, nurse, patient] = await Promise.all([
      doctormodel.findById({ _id: id }),
      nurseModel.findById({ _id: id }),
      patientModel.findById({ _id: id })
    ]);
    const user = doctor || nurse || patient;
    if (!user) {
      return res.status(404).send("User not found by id");
    } else {
      if (user.resetPasswordCode == code) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordCode = undefined;
        user.save();
        res.status(200).send("Password updated successfully");
      } else {
        res.status(400).send("Invalid code");
      }
    }

  } catch (error) {
    res.status(400).json({  message: "degat", error: error});
  }
}




























  /*try {
    await jwt.verify(token, process.env.secret_key!, async (err: any, decoded: any) => {
      if (err) {
        res.send("Invalid or expired token");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [doctor, nurse, patient] = await Promise.all([
          doctormodel.findById({ _id: id }),
          nurseModel.findById({ _id: id }),
          patientModel.findById({ _id: id })
        ]);
        const user = doctor || nurse || patient;
        if (!user) {
          return res.status(404).send("User not found by id");
        } else {
          user.password = hashedPassword;
          user.save();
          res.status(200).send("Password updated successfully");
        }

      }
    })
  } catch (error) { 
    res.status(400).json({ error: error, message: "degat" });
  
  }





}*/




