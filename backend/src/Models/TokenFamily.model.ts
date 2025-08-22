// src/models/tokenFamily.model.ts
import mongoose, { Schema, model } from "mongoose";

export interface ITokenFamily {
  userId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  familyId: string;
  currentTokenId: string;
  revokedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const tokenFamilySchema = new Schema<ITokenFamily>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    familyId: { type: String, required: true },
    currentTokenId: { type: String, required: true, index: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

tokenFamilySchema.index({ userId: 1, familyId: 1 }, { unique: true });

export const TokenFamilyModel = model<ITokenFamily>(
  "TokenFamily",
  tokenFamilySchema
);
