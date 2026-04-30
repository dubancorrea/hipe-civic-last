import mongoose, { Schema, models, model, Model } from "mongoose";

// 1. Define the TypeScript interface representing a User document
// This tells TS exactly what properties a user has when you fetch them
export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "student" | "staff";
  school: string;
  major: string;
  hoursLogged: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ["student", "staff"], 
      default: "student" 
    },
    school: { 
      type: String, 
      default: "CUNY Brooklyn College" 
    },
    major: { 
      type: String, 
      default: "" 
    },
    hoursLogged: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true }
);

// 2. The Critical Fix: Explicitly type the model as Model<IUser>
// This tells TypeScript: "User is a Mongoose Model that handles IUser documents"
// This clears the "This expression is not callable" error in your routes
const User = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

export default User;