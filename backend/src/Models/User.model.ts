import { model, Schema, Document } from "mongoose";
import { comparePassword, hashPassword } from "../utils/bycrpt";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  invitedby: Schema.Types.ObjectId;

  comparePassword(password: string): Promise<boolean>;
  deletePassword(): object;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["freelancer", "client"],
      default: "freelancer",
    },
    invitedby: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await hashPassword(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await comparePassword(password, this.password);
};
userSchema.methods.deletePassword = function () {
  const doc = this.toObject();
  delete doc.password;
  return doc;
};

const User = model<IUser>("User", userSchema);

export default User;
