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
  generateJWT: () => Promise<string>;
};


// Doctor schema
const doctorschema = new Schema<IDoctor>({
  name: { type: String, required: true },
  specialite: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
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