import mongoose, { Document, Schema } from "mongoose";

export interface IDoctor extends Document{ 
  name: string;
  specialite: string;
  phone: Number;
  password: string;
};

const schema = new Schema<IDoctor>({
  name: { type: String, required: true },
  specialite: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
});

//create a model for schema
const doctormodel = mongoose.model<IDoctor>("doctor", schema);

export default doctormodel;