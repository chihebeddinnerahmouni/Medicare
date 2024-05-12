import mongoose, { Schema, Document } from "mongoose";


export interface IRequest {
  // Define the properties of the request object here
  name: string;
  profilePicture: string;
  phone: Number;
  // Add more properties as needed
}



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
  day: String;
  hour: String;
  ticketNumber: number;
  reserved: "reserved" | "free" | "pending";
  code: Number | undefined;
  doctor: string;
  patient: string;
  requestList: IRequest[];
}

const AvailableTimeModel = mongoose.model<IAvailableTime>(
  "AvailableTime",
  AvailableTimeSchema
);

export default AvailableTimeModel;

