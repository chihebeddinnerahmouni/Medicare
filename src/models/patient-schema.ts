import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import availableTime from "../utils/availableTime-table";

interface IPatient extends Document {
  name: string;
  phone: Number;
  email: string;
  password: string;
  verificationCode: String | undefined;
  verified: boolean;
  type: string;
  resetPasswordCode: Number | String | undefined;
  online: { type: Boolean; default: false };
  token: string;
}

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true, unique: true }, //
  phone: { type: Number, required: true, unique: true }, //
  email: { type: String, required: true, unique: true }, //
  password: { type: String, required: true },
  verificationCode: { type: String },
  verified: { type: Boolean, default: false },
  type: { type: String, required: true },
  resetPasswordCode: { type: String },
  online: { type: Boolean, default: false },
  token: { type: String },
});

patientSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const patientModel = mongoose.model<IPatient>("patient", patientSchema);

export default patientModel;