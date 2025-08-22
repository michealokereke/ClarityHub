// src/models/comment.model.ts
import mongoose, { Schema, model } from "mongoose";

export interface IComment {
  tenantId: mongoose.Types.ObjectId;
  deliverableVersionId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    deliverableVersionId: {
      type: Schema.Types.ObjectId,
      ref: "DeliverableVersion",
      required: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

commentSchema.index({ deliverableVersionId: 1, createdAt: -1 });

export const CommentModel = model<IComment>("Comment", commentSchema);
