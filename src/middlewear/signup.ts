import { Request, Response, NextFunction } from 'express';
import { generate6Digits } from '../utils/generate-6-digits';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import dotenv from 'dotenv';
import patientModel from '../models/patient-schema';
import doctormodel from '../models/doctor-schema';
import nurseModel from '../models/nurses-schema';
import crypto from 'crypto';
dotenv.config();
/*declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}*/

export const signup = async (req: Request, res: Response) => {
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY! });
    const { type } = req.body;
    let model: any;
    if (type === 'doctor') {
        model = doctormodel;
    } else if (type === 'patient') {
        model = patientModel;
    } else if (type === 'nurse') {
        model = nurseModel;
    }
    switch (type) {
        case 'doctor':
        case 'nurse':
            try {
                const { name, email, phone, password, specialite, location, type } = req.body;
                const isFieldMissing = !name || !email || !phone || !password || !specialite || !location || !type;
                if (isFieldMissing) {
                    return res.status(400).send("Please fill all fields");
                }
                //Password must contain at least one lowercase letter, one uppercase letter, one number
                const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password);
                if (!passwordRegex || password.length < 8) {
                    return res.status(401).send("Password must contain at least one lowercase letter, one uppercase letter, one number and at least 8 characters long");
                }
                //check if user already exists
                const [exestingDoctor, exictingPatient, existingNurse] =
                    await Promise.all([
                        doctormodel.findOne({
                            $or: [{ email }, { name }, { phone }],
                        }),
                        patientModel.findOne({
                            $or: [{ email }, { name }, { phone }],
                        }),
                        nurseModel.findOne({
                            $or: [{ email }, { name }, { phone }],
                        }),
                    ]);
                const existingUser = exestingDoctor || exictingPatient || existingNurse;
                if (existingUser) {
                    res.status(403).send("User already exists");
                } else {

                    //creat a new doctor or nurse
                    const user = await model!.create({
                        name,
                        email,
                        phone,
                        password,
                        specialite,
                        location,
                        type
                    });

                    const verificationCode = crypto.randomBytes(10).toString("hex"); 
                    user.verificationCode = verificationCode;
                    await user.save();
                    try {
                        const verificationLink = `localhost:3000/verify/?type=${type}&code=${verificationCode}`;
                        const emaildata = {
                            from: `hna <Infos@${process.env.MAILGUN_DOMAIN}>`,
                            to: email,
                            subject: 'Verification Code',
                            text: `click to confirm: ${verificationLink}`
                        }
                        await client.messages.create(process.env.MAILGUN_DOMAIN!, emaildata);
                        res.status(200).json({ message: 'welcom, sign up succesfully and email sent' });
                    } catch (error) {
                        res.status(400).json({ message: 'email not sent', error: error });
                    }
                }
            } catch (error) {
                res.status(400).json({ message: 'degat', error: error });
            }
            break;
        
        
        
        
        
// case patient
        case 'patient':
            try {
                const { name, email, phone, password, type } = req.body;
                const isFieldMissing = !name || !email || !phone || !password || !type;
                if (isFieldMissing) {
                    return res.status(400).send("Please fill all fields");
                }
                //Password must contain at least one lowercase letter, one uppercase letter, one number
                const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password);
                if (!passwordRegex || password.length < 8) {
                    return res.status(401).send("Password must contain at least one lowercase letter, one uppercase letter, one number and at least 8 characters long");
                }
                //check if user already exists
                const [exestingDoctor, exictingPatient, existingNurse] =
                    await Promise.all([
                        doctormodel.findOne({
                            $or: [{ email }, { name }, { phone }],
                        }),
                        patientModel.findOne({
                            $or: [{ email }, { name }, { phone }],
                        }),
                        nurseModel.findOne({
                            $or: [{ email }, { name }, { phone }],
                        }),
                    ]);
                const existingUser = exestingDoctor || exictingPatient || existingNurse;
                if (existingUser) {
                    return res.status(403).send("User already exists");
                } else {
                    
                    //create a new patient
                    const user = await model!.create({
                        name,
                        email,
                        phone,
                        password,
                        type
                    });

                    const verificationCode = crypto.randomBytes(10).toString("hex"); 
                    user.verificationCode = verificationCode;
                    await user.save();
                    //send email
                    try {
                        const verificationLink = `localhost:3000/verify/?type=${type}&code=${verificationCode}`;
                        const emaildata = {
                            from: `hna <mailgun@${process.env.MAILGUN_DOMAIN}>`,
                            to: email,
                            subject: 'Verification Code',
                            text: `click to confirm: ${verificationLink}`
                        }
                        await client.messages.create(process.env.MAILGUN_DOMAIN!, emaildata);
                        res.status(200).json({ message: 'welcom, sign up succesfully and email sent' });
                    }
                    catch (error) {
                        res.status(400).json({ message: 'email not sent', error: error });
                    }
                }
            } catch (error) {
                res.status(400).json({ message: 'degat', error: error });
            }
            break;
        
        default:
            res.status(400).send("type not found");
            break;
        






    }//switch
}//signup











