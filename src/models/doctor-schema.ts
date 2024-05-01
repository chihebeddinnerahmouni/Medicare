import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import availableTime from "../utils/availableTime-table";



// Doctor interface
export interface IDoctor extends Document {
  name: string;
  specialite: string;
  phone: Number;
  password: string;
  email: string;
  location: string;
  available: availableTime[];
  verificationCode: Number | undefined;
  verified: boolean;
  generateJWT: () => Promise<string>;
};



// Doctor schema
const doctorschema = new Schema<IDoctor>({
  name: { type: String, required: true, unique: true },
  specialite: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String, required: true, unique: true },
  available: { type: [availableTime], default: [] },
  verificationCode: { type: Number },
  verified: { type: Boolean, default: false },
});


//hashing password before saving
doctorschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


//generate token
doctorschema.methods.generateJWT = async function (): Promise<string> {
  return await sign({ name: this.name }, process.env.secret_key!);
};




//create a model for schema
const doctormodel = mongoose.model<IDoctor>("doctor", doctorschema);

export default doctormodel;