import mongoose, { Schema, models } from "mongoose";

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// TTL: auto-delete docs after they expire
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
