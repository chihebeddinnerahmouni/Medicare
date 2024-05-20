import { Request, Response, NextFunction } from "express";
import formData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";
import doctormodel from "../modules/doctors/doctor-schema";
import nurseModel from "../modules/nurses/nurses-schema";
import patientModel from "../modules/patients/patient-schema";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { generate6Digits } from "../utils/generate-6-digits";
dotenv.config();


export const sendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => { 
  const { name } = req.body;

  try {
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY!,
    });

    const [doctors, nurses, patients] = await Promise.all([
      doctormodel.findOne({ name }),
      nurseModel.findOne({ name }),
      patientModel.findOne({ name })
    ]);
    const user = doctors || nurses || patients;
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.demandingNewPassword) {
      const email = user.email;
      const type = user.type;
      const code = jwt.sign(
        { id: user._id, type: type },
        process.env.secret_key!,
        { expiresIn: "1m" }
      );
      user.demandingNewPassword = true;
      await user.save();
      const verificationLink = `localhost:3000/resetPassword?code=${code}`;
      const messageData = {
        from: `hna  <Support@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: "Reset Password",
        text: `click here toreset password: ${verificationLink}`,
      };
      await client.messages
        .create(process.env.MAILGUN_DOMAIN!, messageData)
        .then((message: any) => {
          return res.status(201).json({
            user: user.name,
            token: code,
            message: "Email sent successfully",
          });
        })
        .catch((error: any) => {
          return res.status(400).send("Cannot send email");
        });
    } else {
      return res.status(400).send("is not asking for a new password");
    }
       


  




    

  } catch (error) {
    res.status(400).json({ error: error, message: "Cannot send email" });
  }
}























/*export const sendResetPasswordEmail = async (
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
};*/



