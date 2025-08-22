// src/models/deliverable.model.ts
import mongoose, { Schema, model } from "mongoose";

export type DeliverableStatus =
  | "draft"
  | "readyForReview"
  | "changesRequested"
  | "approved";

export interface IDeliverable {
  tenantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  phaseId?: mongoose.Types.ObjectId;
  title: string;
  status: DeliverableStatus;
  currentVersionNumber: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliverableSchema = new Schema<IDeliverable>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    phaseId: { type: Schema.Types.ObjectId, ref: "Phase" },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "readyForReview", "changesRequested", "approved"],
      default: "draft",
    },
    currentVersionNumber: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

deliverableSchema.index({ projectId: 1, status: 1 });
deliverableSchema.index({ tenantId: 1, status: 1 });

export const DeliverableModel = model<IDeliverable>(
  "Deliverable",
  deliverableSchema
);
