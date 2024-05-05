import { Response } from "express";
import FormData from "form-data";
import Mailgun from "mailgun.js";

const sendinSignupEmail = async (
  res: Response,
  email: string,
  verificationCode: string
) => {
  const mailgun = new Mailgun(FormData);
  const client = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });
  try {
    const verificationLink = `localhost:3000/verify?type=nurse&code=${verificationCode}`;
    const data = {
      from: "hna <infos@medicares.me>",
      to: email,
      subject: "Verification Code",
      text: `Your verification link is ${verificationCode}`,
    };
    await client.messages.create(process.env.MAILGUN_DOMAIN!, data);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error sending email", error: error });
  }
};


export default sendinSignupEmail;