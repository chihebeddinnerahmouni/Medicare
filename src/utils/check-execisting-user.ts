import doctormodel from "../models/doctor-schema";
import patientModel from "../models/patient-schema";
import nurseModel from "../models/nurses-schema";
import { Response } from "express";


const checkExistingUser = async (res: Response, email: String, name: String, phone: String ) => {
    const [doctorex, nurseex, patientex] = await Promise.all([
        doctormodel.findOne({ $or: [{ email }, { name }, { phone }] }),
        nurseModel.findOne({ $or: [{ email }, { name }, { phone }] }),
        patientModel.findOne({ $or: [{ email }, { name }, { phone }] }),
    ]);
    const isUserExist = doctorex || nurseex || patientex;
    return !!isUserExist;
}

// Helper function to handle existing user check
const handleExistingUser = async (res: Response, email: string, name: string, phone: string): Promise<boolean> => {
    const existingUser = await checkExistingUser(res, email, name, phone);
    if (existingUser) {
        res.status(400).send("User already exists");
        return true;
    }
    return false;
};

export default handleExistingUser;