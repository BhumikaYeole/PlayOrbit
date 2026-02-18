import mongoose from "mongoose";

const playerRequestSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },

  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },

  message: { type: String },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PlayerRequest", playerRequestSchema);
