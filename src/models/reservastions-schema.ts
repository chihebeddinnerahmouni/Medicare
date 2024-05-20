import mongoose, {Schema} from "mongoose";
import IAvailableTime from "./availableTime-schema";
import doctormodel from "../modules/doctors/doctor-schema";
import patientModel from "../modules/patients/patient-schema";

 interface IReservation extends Document {
    doctor: typeof doctormodel["name"];
    patient: typeof patientModel["name"];
    availableTime: any;
}

const ReservationSchema = new Schema({
    doctor: {ref: "Doctor", required: true },
    patient: {ref: "Patient", required: true },
    availableTime: {
        ref: "AvailableTime",
        required: true,
    },
});

const ReservationModel = mongoose.model<IReservation>(
  "Reservation",
  ReservationSchema
);

export default ReservationModel;