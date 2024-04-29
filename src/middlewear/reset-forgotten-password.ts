import { Request, Response,NextFunction } from "express";
import dotenv from "dotenv";
import doctormodel from "../models/doctor-schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
dotenv.config();







//reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {

  //getting id and token 
  const { id, token } = req.params;
  const { password } = req.body;

  //verifying token
  await jwt.verify(token, process.env.secret_key!, async (err: any, decoded: any) => {
    //if token is invalid
    if (err) {
      console.error(err);
      res.json({ error: err, message: "Invalid or expired token" });
    }
    //if token is valid
    else {
      console.log(decoded);
      await bcrypt.hash(password, 10).then((hash: any) => {
        doctormodel.findByIdAndUpdate({ _id: id }, { password: hash }, { new: true })
          .then((u: any) => { res.json({ message: "Password updated successfully" }) })
          .catch((err: any) => { res.json({ error: err, message: "Cannot update password" }) });
      })
        .catch((err: any) => { res.json({ error: err }) });
    }
  })
}