import doctormodel from "../modules/doctors/doctor-schema";
import patientModel from "../modules/patients/patient-schema";
import nurseModel from "../modules/nurses/nurses-schema";
import { Request, Response } from "express";

const findUserById = async (req: Request, res: Response, type: String, id: any) => {
    
    interface UserModel {
        findById: (arg0: { id: any }) => Promise<any>;
    }
    let model: UserModel;

    if (type == "doctor") {
      model = doctormodel;
    } else if (type == "nurse") {
      model = nurseModel;
    } else if (type == "patient") {
      model = patientModel;
    }

    try {
        const user = await model!.findById(id);
        if (!user) return console.log("User not found");
        return user;
    } catch (error) {
        console.log({ message: "degat", err: error });
    }
}

export default findUserById;