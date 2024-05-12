import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import { AvailableTimeSchema, IAvailableTime } from "./availableTime-table";
dotenv.config();


interface IPatient extends Document {
  name: string;
  phone: Number;
  email: string;
  password: string;
  verificationCode: String | undefined;
  verified: boolean;
  type: string;
  demandingNewPassword: Boolean;
  online: Boolean;
  token: string;
  refreshToken: string;
  tokenVersion: number;
  profilePicture: string;
  coverPicture: string;
  //reservationsRequests: IAvailableTime[];
  reservationsRequests: IAvailableTime[];
  reservations: IAvailableTime[];
}

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true, unique: true }, //
  phone: { type: Number, required: true, unique: true }, //
  email: { type: String, required: true, unique: true }, //
  password: { type: String, required: true },
  verificationCode: { type: String },
  verified: { type: Boolean, default: false },
  type: { type: String, required: true },
  demandingNewPassword: { type: String, default: false },
  online: { type: Boolean, default: false },
  token: { type: String },
  refreshToken: { type: String },
  tokenVersion: { type: Number, default: 0 },
  profilePicture: { type: String },
  coverPicture: { type: String },
  //reservationsRequests: { type: [AvailableTimeSchema], default: [] },
  reservationsRequests: { type: [AvailableTimeSchema], default: [] },
  reservations: { default: [] },
});

patientSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
  next();
})

const patientModel = mongoose.model<IPatient>("patient", patientSchema);

export default patientModel;