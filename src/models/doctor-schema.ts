import mongoose from "mongoose";



const schema = new mongoose.Schema({
  name: String,
  specialite: String,
  phone: Number,
  password: String,
});

//create a model for schema
const doctormodel = mongoose.model("doctor", schema);

export default doctormodel;