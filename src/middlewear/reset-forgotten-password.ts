import { Request, Response,NextFunction } from "express";
import dotenv from "dotenv";
import doctormodel from "../modules/doctors/doctor-schema";
import nurseModel from "../modules/nurses/nurses-schema";
import patientModel from "../modules/patients/patient-schema";
import handlePasswordStrength from "../utils/check-password-strength";
import jwt from "jsonwebtoken";
import definingModel from "../utils/defining-model";
dotenv.config();


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query;
  const { password } = req.body;
  jwt.verify(code as string, process.env.secret_key!, async (err: any, decoded: any) => {
    try {
      if (err) {
        return res.status(401).send("Invalid or expired token"+err); 
      }
      const id = decoded.id;
      const type = decoded.type;
      const model = await definingModel(type);
      const user = await model!.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      } else if (user.demandingNewPassword) {
        handlePasswordStrength(res, password);
        user.demandingNewPassword = false;
        user.password = password;
        await user.save();
        return res.status(200).send("Password updated successfully");
      } else {
        return res.status(400).send("is not asking for a new password");
      }
    

    } catch (error) {
      return res.status(400).json({ message: "degat", error: error });
    }
  });
};




























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




