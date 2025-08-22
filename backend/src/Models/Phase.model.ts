// src/models/phase.model.ts
import mongoose, { Schema, model } from "mongoose";

export interface IPhase {
  tenantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  name: string;
  order: number;
  status: string;
  dueAt?: Date;
  milestone: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const phaseSchema = new Schema<IPhase>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true },
    status: { type: String, required: true },
    dueAt: Date,
    milestone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

phaseSchema.index({ projectId: 1, order: 1 });

export const PhaseModel = model<IPhase>("Phase", phaseSchema);
