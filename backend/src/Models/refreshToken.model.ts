import { Schema, Document, model } from "mongoose";
import User from "./User.model";
import { comparePassword, hashPassword } from "../utils/bycrpt";
import { sha256 } from "../utils/sha256";

export interface refreshTokenTypes extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  fingerPrint: string;
  revoked: boolean;
}

const refreshTokenSchema = new Schema<refreshTokenTypes>(
  {
    userId: { type: Schema.Types.ObjectId, ref: User },
    token: { type: String, index: true },
    fingerPrint: { type: String },
    revoked: { type: Boolean },
  },
  { timestamps: true }
);

refreshTokenSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  this.token = await sha256(this.token);
  next();
});

const RefreshTokenModel = model<refreshTokenTypes>(
  "refreshToken",
  refreshTokenSchema
);

export default RefreshTokenModel;
