import mongoose, { Schema, Document } from "mongoose";

export const AvailableTimeSchema = new Schema({
  day: { type: String, required: true },
  hour: { type: String, required: true },
  ticketNumber: { type: Number, required: true },
  reserved: { type: Boolean, default: false , required: true},
  code: { type: Number, required: true, unique: true },
  doctor: { type: String },
  patient: { type: String },
});

export interface IAvailableTime extends Document {
  day: String;
  hour: String;
  ticketNumber: number;
  reserved: boolean;
  code: Number;
  doctor: string;
  patient: string;
}

const AvailableTime = mongoose.model<IAvailableTime>(
  "AvailableTime",
  AvailableTimeSchema
);

export default AvailableTime;

