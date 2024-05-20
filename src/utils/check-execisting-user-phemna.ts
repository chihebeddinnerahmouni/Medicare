import doctormodel from "../modules/doctors/doctor-schema";
import patientModel from "../modules/patients/patient-schema";
import nurseModel from "../modules/nurses/nurses-schema";
import { Response } from "express";


const checkExistingUser = async (
  res: Response,
  email: String,
  name: String,
  phone: Number
) => {

    const [doctorex, nurseex, patientex] = await Promise.all([
    doctormodel.findOne({ $or: [{ email }, { name }, { phone }] }),
    nurseModel.findOne({ $or: [{ email }, { name }, { phone }] }),
    patientModel.findOne({ $or: [{ email }, { name }, { phone }] }),
  ]);
  const isUserExist = doctorex || nurseex || patientex;
  return isUserExist;
};

// Helper function to handle existing user check
const handleExistingUser = async (
  res: Response,
  email: string,
  name: string,
  phone: Number
) => {
  const existingUser = await checkExistingUser(res, email, name, phone);
  if (existingUser) {
    res.status(400).send("User already exists" + existingUser);
    return true;
  }
  return false;
};

export default handleExistingUser;