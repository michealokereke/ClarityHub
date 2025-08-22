import { model, Schema, Document, Types } from "mongoose";
import { comparePassword, hashPassword } from "../utils/bycrpt";

interface ProfileSchema {
  name: string;
  title: string;
  phone: string;
  avatarUrl: string;
  location: string;
  bio: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;

  email: string;
  password: string;
  role: "agencyAdmin" | "freelancer" | "client" | "readOnly";
  status: "active" | "invited" | "disabled";
  lastLoginAt: Date;
  tenantId: Schema.Types.ObjectId;
  updatedAt: Date;
  profile: ProfileSchema;

  comparePassword(password: string): Promise<boolean>;
  deletePassword(): object;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    tenantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Tenant",
      index: true,
    },

    profile: {
      name: { type: String, required: true },
      title: { type: String },
      phone: { type: String },
      avatarUrl: { type: String },
      location: { type: String },
      bio: { type: String },
    },
    role: {
      type: String,
      enum: ["freelancer", "client", "agencyAdmin", "readOnly"],
      default: "freelancer",
    },

    lastLoginAt: {
      type: Date,
    },

    status: {
      type: String,
      required: true,
      enum: ["active", "invited", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

userSchema.index({ tenantId: 1, role: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

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
