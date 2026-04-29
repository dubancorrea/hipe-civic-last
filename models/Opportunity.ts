import mongoose, { Schema, models } from "mongoose";

const OpportunitySchema = new Schema(
  {
    title: { type: String, required: true },
    org: { type: String, required: true },
    category: { type: String, required: true },
    major: { type: [String], default: [] },
    hours: { type: Number, default: 1 },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
    date: { type: String, default: "" },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Opportunity || mongoose.model("Opportunity", OpportunitySchema);
