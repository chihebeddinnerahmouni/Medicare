import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import availableTime from "../utils/availableTime-table";

interface IPatient extends Document { 
    name: string;
    phone: string;
    email: string;
    password: string;
    verificationCode: Number;
    verified: boolean;
    type: string;
}

const patientSchema = new Schema<IPatient>({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verificationCode: { type: Number},
    verified: { type: Boolean, default: false },
    type: { type: String, required: true},
});

patientSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const patientModel = mongoose.model<IPatient>("patient", patientSchema);

export default patientModel;