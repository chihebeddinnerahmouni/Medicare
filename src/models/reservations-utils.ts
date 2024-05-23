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

export const reservationRequestsModel = mongoose.model<IReservationRequests>(
  "reservationRequests",
  reservationRequestsSchema
);

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

export interface IAvailableTime extends Document {
  day: string;
  hour: string;
  ticketNumber: number;
  reserved: "reserved" | "free" | "pending" | "rejected";
  code: number | string| undefined;
  doctor: string;
  patient: string;
  requestList: IRequest[];
}

export const AvailableTimeModel = mongoose.model<IAvailableTime>(
  "AvailableTime",
  AvailableTimeSchema
);

//______________________________________________________________________________________

//reservation
 interface IReservation extends Document {
   doctor: string;
   patient: string;
   availableTime: any;
 }

 const ReservationSchema = new Schema({
   doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
   patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
   availableTime: {
     type: Schema.Types.ObjectId,
     ref: "AvailableTime",
     required: true,
   },
 });

 export const ReservationModel = mongoose.model<IReservation>(
   "Reservation",
   ReservationSchema
 );

//______________________________________________________________________________________

//doctor shedule
export interface IScheduleDate {
  hour: string;
  ticketNumber: number;
  reserved: string;
}
const scheduleDateSchema = new Schema(
  {
    hour: { type: String, required: true },
    ticketNumber: { type: Number, required: true },
    reserved: { type: String, required: true, default: "free" },
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
});

export const scheduleModel = mongoose.model<ISchedule>("schedule", scheduleSchema);


//______________________________________________________________________________________

//patient schedule reservation
export interface IPatientScheduleReservation {
  doctor: string;
  patient: string;
  day: string;
  hour: string;
  ticketNumber: number;
}

export const patientScheduleReservationSchema = new Schema({
  doctor: { type: String, required: true },
  patient: { type: String, required: true },
  day: { type: String, required: true },
  hour: { type: String, required: true },
  ticketNumber: { type: Number, required: true },
},
{ _id: false });








