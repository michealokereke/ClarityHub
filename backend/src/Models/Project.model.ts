// src/models/project.model.ts
import mongoose, { Schema, model } from "mongoose";

export type ProjectStatus =
  | "draft"
  | "active"
  | "onHold"
  | "completed"
  | "archived";

export interface IProject {
  tenantId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: ProjectStatus;
  startAt?: Date;
  dueAt?: Date;
  assigneeIds: mongoose.Types.ObjectId[];
  budget?: number;
  phaseIds?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["draft", "active", "onHold", "completed", "archived"],
      default: "active",
    },
    startAt: Date,
    dueAt: Date,
    assigneeIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    budget: Number,
    phaseIds: [{ type: Schema.Types.ObjectId, ref: "Phase" }],
  },
  { timestamps: true }
);

projectSchema.index({ tenantId: 1, clientId: 1 });
projectSchema.index({ tenantId: 1, status: 1 });
projectSchema.index({ title: "text", description: "text" });

export const ProjectModel = model<IProject>("Project", projectSchema);
