import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  getAllDoctors,
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  login,
  authenticateToken
} from "../controllers/doctor-controllers";
import { sendConfirmationEmail, verifyConfirmationCode } from "../controllers/email-verification-controllers";






const router = express.Router();

// get all doctors
router.get("/",authenticateToken ,getAllDoctors);

//create a doctor
router.post("/", createDoctor);

// get one doctor
router.get("/:name", getDoctor);

// update a doctor
router.put("/:name", updateDoctor);

// delete a doctor
router.delete("/:name", deleteDoctor);

// login
router.post("/login", login);

//email confirmation 
router.post("/emailConfirmation", sendConfirmationEmail);











/* send confirmation email
router.post("/send-confirmation", async (req: Request, res: Response) => {
  const mailgun = Mailgun({
    apiKey: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string,
  });
  const email  = req.body.email;
  const confirmationCode = Math.floor(Math.random() * 1000000); // Generate a random 6-digit number

  const data = {
    from: "Your Name <your-email@your-domain.com>",
    to: email,
    subject: "Email Confirmation",
    text: `Your confirmation code is: ${confirmationCode}`,
  };

  try {
    await Mailgun.messages().send(data);
    res.json({ message : "sentsucces" }); // Send the confirmation code in the response for testing purposes
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/











module.exports = router;
