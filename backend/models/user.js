import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: 1,
      maxLength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["provider", "player"],
      required: [true, "Please select user role"],
      lowercase: true,
    },
    sportsInterested: [{ type: String }],

    playerProfile: {
      roleInSport: { type: String }, // striker, defender etc
      totalMatchesPlayed: { type: Number, default: 0 },
      requestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "PlayerRequest" }],
      requestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "PlayerRequest" }],
      experienceLevel: { type: String, enum: ["beginner", "intermediate", "advanced"] , default: "beginner" },
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;