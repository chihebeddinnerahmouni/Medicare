import { Request, Response, NextFunction } from "express";
import formData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";
import doctormodel from "../models/doctor-schema";
import jwt from "jsonwebtoken";
dotenv.config();


export const sendResetPasswordEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //mailgun
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });
  //finding user
  try {
    const email = req.body.email;
    const user = await doctormodel.findOne({ email: email });
    if (!user) {
      res.send("User not found");
    }
    //generating token
    const token = await jwt.sign({ id: user!._id }, process.env.secret_key!);
    const verificationLink = `localhost:3000/doctors/resetPassword/${
      user!._id
    }/${token}`;
    //creating message data
    const messageData = {
      from: `hna  <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: user!.email,
      subject: "Reset Password",
      text: `Click the following link to reset your password: ${verificationLink}`,
    };
    //sending email
    await client.messages
      .create(process.env.MAILGUN_DOMAIN!, messageData)
      .then((message: any) => {
        console.log("sent succes");
        const sanitizedUser = {
          name: user!.name,
          email: user!.email,
          specialite: user!.specialite,
          phone: user!.phone,
        };
        return res
          .status(201)
          .json({
            user: sanitizedUser,
            token: token,
            message: "Email sent successfully",
          });
      })
      .catch((err: any) => {
        res.json({ error: err, message: "mahabch yo3gb" });
      });
  } catch (error: any) {
    res.send("degat f l'envoi de l'email");
  }
  next();
};



