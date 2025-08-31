import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  room_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  message_text: string;
  parent_message_id?: Schema.Types.ObjectId;
  media_url?: string;
  media_type?: string;
}

const messageSchema = new Schema<IMessage>(
  {
    room_id: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message_text: { type: String, required: true },
    parent_message_id: { type: Schema.Types.ObjectId, ref: "Message" },
    media_url: { type: String },
    media_type: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Message = model<IMessage>("Message", messageSchema);
export default Message;
