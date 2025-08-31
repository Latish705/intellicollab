import { Schema, model, Document } from "mongoose";

export interface IOrganisation extends Document {
  name: string;
  owner_id: Schema.Types.ObjectId;
}

const organisationSchema = new Schema<IOrganisation>(
  {
    name: { type: String, required: true },
    owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Organisation = model<IOrganisation>("Organisation", organisationSchema);
export default Organisation;
