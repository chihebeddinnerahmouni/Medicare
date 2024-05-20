import { Request, Response, NextFunction } from 'express';
import doctorModel from '../modules/doctors/doctor-schema';
import nurseModel from '../modules/nurses/nurses-schema';


const searchMedicalStaff = async (req: Request, res: Response, next: NextFunction) => { 

    const { name } = req.query;
    try {
        const doctors = await doctorModel.find({name: { $regex: `^${name}`, $options: "i" },});
        const nurses = await nurseModel.find({ name: { $regex: `^${name}`, $options: "i" }, });
        if (doctors.length === 0 && nurses.length === 0) return res.status(404).send("No doctors or nurses found");
        return res.status(200).json({doctors, nurses});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error getting all nurses and doctors", error: error });
    }
}

export default searchMedicalStaff; 