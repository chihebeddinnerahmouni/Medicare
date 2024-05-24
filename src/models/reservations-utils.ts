import mongoose from "mongoose";
import { Document } from "mongoose";
import { Schema } from "mongoose";

//requests list for doctor
export interface IRequest {
  name: string;
  profilePicture: string;
  phone: Number;
}

//______________________________________________________________________________________

//reservation requests in patient
export interface IReservationRequests {
  day: string;
  hour: string;
  ticketNumber: number;
  reserved: string;
  code: number;
  doctor: string;
  patient: string;
}

export const reservationRequestsSchema =
  new mongoose.Schema<IReservationRequests>({
    day: { type: String, required: true },
    hour: { type: String, required: true },
    ticketNumber: { type: Number, required: true },
    reserved: { type: String, required: true },
    code: { type: Number, required: true },
    doctor: { type: String, required: true },
    patient: { type: String, required: true },
  });

/*export const reservationRequestsModel = mongoose.model<IReservationRequests>(
  "reservationRequests",
  reservationRequestsSchema
);*/

//______________________________________________________________________________________


//available time in doctor
export const AvailableTimeSchema = new Schema({
  day: { type: String, required: true },
  hour: { type: String, required: true },
  ticketNumber: { type: Number, required: true },
  reserved: {type: String, required: true},
  code: { type: Number, required: true },
  doctor: { type: String },
  patient: { type: String },
  requestList: { type: Array, default: [] }
});

export interface IAvailableTime {
  day: string;
  hour: string;
  ticketNumber: number;
  reserved: "reserved" | "free" | "pending" | "rejected";
  code: number | string| undefined;
  doctor: string;
  patient: string;
  requestList: IRequest[];
}

/*export const AvailableTimeModel = mongoose.model<IAvailableTime>(
  "AvailableTime",
  AvailableTimeSchema
);
*/

//______________________________________________________________________________________

//doctor shedule
export interface IScheduleDate {
  hour: string;
  ticketNumber: number;
  reserved: string;
  patient: string;
  patientPhone: number;
}
const scheduleDateSchema = new Schema(
  {
    hour: { type: String, required: true },
    ticketNumber: { type: Number, required: true },
    reserved: { type: String, required: true, default: "free" },
    patient: { type: String },
    patientPhone: { type: Number },
  },
  { _id: false }
);


export interface ISchedule {
  day: string;
  start: string;
  end: string;
  checkTime: number;
  doctor: string;
  freeAt: IScheduleDate[];
}

export const scheduleSchema = new Schema({
  day: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  checkTime: { type: Number, required: true },
  doctor: { type: String },
  freeAt: { type: [scheduleDateSchema] },
}, { _id: false });

//export const scheduleModel = mongoose.model<ISchedule>("schedule", scheduleSchema);


//______________________________________________________________________________________

//patient schedule reservation
export interface IPatientScheduleReservation {
  doctor: string;
  day: string;
  hour: string;
  ticketNumber: number;
  location: string;
  phone: number;
  reservedAt: string;
}

export const patientScheduleReservationSchema = new Schema({
  doctor: { type: String, required: true },
  day: { type: String, required: true },
  hour: { type: String, required: true },
  ticketNumber: { type: Number, required: true },
  location: { type: String },
  phone: { type: Number },
  reseredAt: { type: String },
},
{ _id: false });








