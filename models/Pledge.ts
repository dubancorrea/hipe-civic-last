import mongoose, { Schema, models } from "mongoose";

const PledgeSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    type: { type: String, enum: ["vote", "campaign"], required: true },
    campaign: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.Pledge || mongoose.model("Pledge", PledgeSchema);
