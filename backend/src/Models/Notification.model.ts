// src/models/notification.model.ts
import mongoose, { Schema, model } from "mongoose";

export interface INotification {
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  body: string;
  link?: string;
  readAt?: Date;
  createdAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    link: { type: String },
    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ userId: 1, readAt: 1 });
notificationSchema.index({ tenantId: 1, createdAt: -1 });

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);
