import moongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = moongoose.Schema;

export interface IAdmin extends moongoose.Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  tokenVersion: number | undefined;
  type: string;
  verificationCode: string;
  token: string;
  online: boolean;
}

const adminSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokenVersion: { type: Number },
  type: { type: String, required: true, default: "admin" },
  verificationCode: { type: String },
  token: { type: String },
  online: { type: Boolean, default: false },
});

// hash password
adminSchema.pre("save", async function (next) { 
      if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      next();
});

const adminModel = moongoose.model<IAdmin>("Admin", adminSchema);

export default adminModel;