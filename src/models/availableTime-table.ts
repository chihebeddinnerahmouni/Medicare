import mongoose, { Schema, Document } from "mongoose";
import { IRequest } from "./requests-models";



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
  reserved: "reserved" | "free" | "pending";
  code: number | string| undefined;
  doctor: string;
  patient: string;
  requestList: IRequest[];
}

const AvailableTimeModel = mongoose.model<IAvailableTime>(
  "AvailableTime",
  AvailableTimeSchema
);

export default AvailableTimeModel;

