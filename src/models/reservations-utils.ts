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
