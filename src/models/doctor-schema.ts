import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { AvailableTimeSchema, IAvailableTime } from "../utils/availableTime-table";



// Doctor interface
export interface IDoctor extends Document {
  name: string;
  specialite: string;
  phone: Number;
  password: string;
  email: string;
  location: string;
  available: IAvailableTime[];
  verificationCode: String | undefined;
  verified: boolean;
  generateJWT: () => Promise<string>;
  type: string;
  demandingNewPassword: Boolean;
  online: Boolean;
  token: string;
  tokenVersion: number;
};



// Doctor schema
const doctorschema = new Schema<IDoctor>({
  name: { type: String, required: true, unique: true }, //
  specialite: { type: String, required: true },
  phone: { type: Number, required: true, unique: true }, //
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }, //
  location: { type: String, required: true },
  available: { type: [AvailableTimeSchema], default: [] },
  verificationCode: { type: String },
  verified: { type: Boolean, default: false },
  type: { type: String, required: true },
  demandingNewPassword: { type: Boolean, default: false},
  online: { type: Boolean, default: false },
  token: { type: String },
  tokenVersion: { type: Number, default: 0 },
});


//hashing password before saving
doctorschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});





//create a model for schema
const doctormodel = mongoose.model<IDoctor>("doctor", doctorschema);

export default doctormodel;