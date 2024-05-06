import mongoose, { Schema, Document } from "mongoose";

export const AvailableTimeSchema = new Schema({
  day: { type: String, required: true },
  hour: { type: String, required: true },
  ticketNumber: { type: Number, required: true },
});

export interface IAvailableTime extends Document {
  day: String;
  hour: String;
  ticketNumber: number;
}

const AvailableTime = mongoose.model<IAvailableTime>(
  "AvailableTime",
  AvailableTimeSchema
);

export default AvailableTime;

