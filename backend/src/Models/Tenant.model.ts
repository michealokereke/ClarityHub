import { Document, Types } from "mongoose";
import mongoose, { Schema, model } from "mongoose";

export interface ITenant extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 140,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TenantSchema.index({ name: 1 }, { unique: true });

export const TenantModel = model<ITenant>("Tenant", TenantSchema);
