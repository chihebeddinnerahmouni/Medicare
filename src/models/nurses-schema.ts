import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {
  AvailableTimeSchema,
  IAvailableTime,
  IDemndeNurseRaquest,
  demandeNurseRaquestSchema,
} from "./reservations-utils";
dotenv.config();

// Nurse interface
export interface INurse {
  name: string;
  specialite: string;
  phone: Number;
  password: string;
  email: string;
  available: IAvailableTime[];
  verificationCode: String | undefined;
  verified: boolean;
  generateJWT: () => Promise<string>;
  type: string;
  demandingNewPassword: Boolean;
  online: Boolean;
  token: string;
  refreshToken: string;
  tokenVersion: number;
  profilePicture: string;
  coverPicture: string;
  workStatus: "off" | "free" | "pending" | "busy";
  patientRequests: IDemndeNurseRaquest[];
  ratingNumber: number;
  ratingSum: number;
  patientClients: number;
  averageRating: number;
  patientComments: object[];
  location: {
    type: string;
    coordinates: number[];
  };
}



// Doctor schema
const nurseSchema = new Schema<INurse>({
  name: { type: String, required: true, unique: true }, //
  specialite: { type: String, required: true },
  phone: { type: Number, required: true, unique: true }, //
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }, //
  available: { type: [AvailableTimeSchema], default: [] },
  verificationCode: { type: String },
  verified: { type: Boolean, default: false },
  type: { type: String, required: true },
  demandingNewPassword: { type: String, default: false },
  online: { type: Boolean, default: false },
  token: { type: String },
  refreshToken: { type: String },
  tokenVersion: { type: Number, default: 0 },
  profilePicture: { type: String },
  coverPicture: { type: String },
  workStatus: { type: String, default: "off" },
  patientRequests: { type: [demandeNurseRaquestSchema], default: [] },
  ratingNumber: { type: Number, default: 0 },
  ratingSum: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  patientClients: { type: Number, default: 0 },
  patientComments: { type: [Object], default: [] },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
});

nurseSchema.index({ location: "2dsphere" });

//hashing password before saving
nurseSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


//create a model for schema
const nurseModel = mongoose.model<INurse>('nurse', nurseSchema);

//export model
export default nurseModel;