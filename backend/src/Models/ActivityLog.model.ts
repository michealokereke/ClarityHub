// src/models/activityLog.model.ts
import mongoose, { Schema, model } from "mongoose";

export interface IActivityLog {
  tenantId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId;
  resourceType: string;
  resourceId: mongoose.Types.ObjectId;
  action: string;
  payload: Record<string, any>;
  createdAt?: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activityLogSchema.index({
  tenantId: 1,
  resourceType: 1,
  resourceId: 1,
  createdAt: -1,
});

export const ActivityLogModel = model<IActivityLog>(
  "ActivityLog",
  activityLogSchema
);
