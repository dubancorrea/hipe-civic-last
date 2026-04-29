import mongoose, { Schema, models } from "mongoose";

const RSVPSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    eventId: { type: String, required: true },
    eventTitle: { type: String, required: true },
    eventDate: { type: String, default: "" },
  },
  { timestamps: true }
);

RSVPSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export default models.RSVP || mongoose.model("RSVP", RSVPSchema);
