import { Schema, model, Document } from "mongoose";

export interface IRoom extends Document {
  organisation_id: Schema.Types.ObjectId;
  name: string;
  description?: string;
  created_by_user_id: Schema.Types.ObjectId;
  is_private: boolean;
}

const roomSchema = new Schema<IRoom>(
  {
    organisation_id: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    created_by_user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_private: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Room = model<IRoom>("Room", roomSchema);
export default Room;
