import { Response } from "express";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import jwt from "jsonwebtoken";

const sendinSignupEmail = async (
  res: Response,
  email: string,
  type: string,
  name: string
) => {
  const mailgun = new Mailgun(FormData);
  const client = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });
  try {
    const token = jwt.sign({ name: name, type: type }, process.env.secret_key as string);
    const verificationLink = `localhost:3000/verify?code=${token}`;
    const data = {
      from: "<infos@medicares.me>",
      to: email,
      subject: "Verification Code",
      text: `Your verification link is ${verificationLink}`,
    };
    await client.messages.create(process.env.MAILGUN_DOMAIN!, data);
    res.status(200).json({ message: "Email sent successfully please check it" });
  } catch (error) {
    res.status(400).json({ message: "Error sending email", error: error });
  }
};


export default sendinSignupEmail;