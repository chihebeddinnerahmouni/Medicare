import { Schema } from "mongoose";

const availableTime = new Schema({
  date: { type: Date, required: true },
  hour: { type: Number, required: true },
  minute: { type: Number, required: true },
  price: { type: Number, required: true },
  ticketNumber: { type: Number, required: true },
});

type availableTime = {
  date: Date;
  hour: number;
  minute: number;
  price: number;
  ticketNumber: number;
};
export default availableTime;
