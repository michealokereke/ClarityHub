// src/models/inviteToken.model.ts
import mongoose, { Schema, model } from "mongoose";

export interface IInviteToken {
  token: string;
  email: string;
  role: "agencyAdmin" | "freelancer" | "client" | "readOnly";
  tenantId: mongoose.Types.ObjectId;
  expiresAt: Date;
  usedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
}

const inviteTokenSchema = new Schema<IInviteToken>(
  {
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["agencyAdmin", "freelancer", "client", "readOnly"],
      required: true,
    },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// inviteTokenSchema.index({ token: 1 }, { unique: true });
inviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL

export const InviteTokenModel = model<IInviteToken>(
  "InviteToken",
  inviteTokenSchema
);
