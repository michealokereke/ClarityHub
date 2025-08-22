// src/models/deliverableVersion.model.ts
import mongoose, { Schema, model } from "mongoose";

export interface IDeliverableVersion {
  tenantId: mongoose.Types.ObjectId;
  deliverableId: mongoose.Types.ObjectId;
  versionNumber: number;
  submittedBy: mongoose.Types.ObjectId;
  submittedAt: Date;
  fileUrl: string;
  notes?: string;
}

const deliverableVersionSchema = new Schema<IDeliverableVersion>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    deliverableId: {
      type: Schema.Types.ObjectId,
      ref: "Deliverable",
      required: true,
    },
    versionNumber: { type: Number, required: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    submittedAt: { type: Date, required: true },
    fileUrl: { type: String, required: true },
    notes: String,
  },
  { timestamps: true }
);

deliverableVersionSchema.index(
  { deliverableId: 1, versionNumber: 1 },
  { unique: true }
);

export const DeliverableVersionModel = model<IDeliverableVersion>(
  "DeliverableVersion",
  deliverableVersionSchema
);
