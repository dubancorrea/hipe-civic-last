import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "staff"], default: "student" },
    school: { type: String, default: "" },
    major: { type: String, default: "" },
    hoursLogged: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
