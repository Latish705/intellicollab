import { Schema, model, Document } from "mongoose";

export interface IOrganisationMember extends Document {
  organisation_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  role: "admin" | "member"; // Example roles
}

const organisationMemberSchema = new Schema<IOrganisationMember>(
  {
    organisation_id: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  {
    timestamps: { createdAt: "joined_at" },
  }
);

// Ensure a user can only be in an organization once
organisationMemberSchema.index(
  { organisation_id: 1, user_id: 1 },
  { unique: true }
);

const OrganisationMember = model<IOrganisationMember>(
  "OrganisationMember",
  organisationMemberSchema
);
export default OrganisationMember;
