import mongoose, { Document, Schema } from "mongoose";
const bcrypt = require('bcrypt');
import { sign } from "jsonwebtoken";
require("dotenv").config();

// Doctor interface
export interface IDoctor extends Document {
  name: string;
  specialite: string;
  phone: Number;
  password: string;
  email: string;
  location: string;
  availableTime: Array<{
    date: Date;
    hour: Number;
    minute: Number;
    price: Number;
    ticketNumber: Number;
  }>;
  verificationCode: Number | undefined;
  verified: boolean;
  generateJWT: () => Promise<string>;
};

//free time schema
const timeSlotSchema = new Schema({
  date: { type: Date, required: true },
  hour: { type: Number, required: true },
  minute: { type: Number, required: true },
  price: { type: Number, required: true },
  ticketNumber: { type: Number, required: true }
});


// Doctor schema
const doctorschema = new Schema<IDoctor>({
  name: { type: String, required: true, unique: true},
  specialite: { type: String, required: true },
  phone: { type: Number, required: true, unique: true},
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String, required: true, unique: true },
  availableTime: { type: [timeSlotSchema], default: [] },
  verificationCode: { type: Number },
  verified: { type: Boolean, default: false }
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