// src/models/payment.model.ts
import mongoose, { Schema, model } from "mongoose";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IPayment {
  tenantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  invoiceId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  paidAt?: Date;
  externalRefId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    method: { type: String, required: true },
    paidAt: Date,
    externalRefId: String,
  },
  { timestamps: true }
);

paymentSchema.index({ tenantId: 1, projectId: 1 });
paymentSchema.index({ invoiceId: 1 });

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
