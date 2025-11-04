import mongoose, { Schema, Document, model } from "mongoose";

interface IMongoMessage extends Document {
  _id: string;
  senderId: string;
  chatId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const mongoMessageSchema = new Schema<IMongoMessage>(
  {
    senderId: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MongoMessage = model<IMongoMessage>("MongoMessages", mongoMessageSchema);
export default MongoMessage;
