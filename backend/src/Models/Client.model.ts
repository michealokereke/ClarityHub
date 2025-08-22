// src/models/client.model.ts
import mongoose, { Schema, model } from "mongoose";

interface Contact {
  name: string;
  email: string;
  phone?: string;
}

export interface IClient {
  tenantId: mongoose.Types.ObjectId;
  orgName: string;
  contacts: Contact[];
  billingEmail: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const contactSchema = new Schema<Contact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
  },
  { _id: false }
);

const clientSchema = new Schema<IClient>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    orgName: { type: String, required: true },
    contacts: { type: [contactSchema], default: [] },
    billingEmail: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

clientSchema.index({ tenantId: 1, orgName: 1 });
clientSchema.index({ tenantId: 1, "contacts.email": 1 });

export const ClientModel = model<IClient>("Client", clientSchema);
