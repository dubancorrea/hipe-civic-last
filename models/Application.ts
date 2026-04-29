import mongoose, { Schema, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    opportunityId: { type: String, required: true, index: true },
    opportunityTitle: { type: String, required: true },
    motivation: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending",
    },
    hoursLogged: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Application || mongoose.model("Application", ApplicationSchema);
