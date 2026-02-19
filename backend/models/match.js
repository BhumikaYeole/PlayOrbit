import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  sport: { type: String, required: true },

  turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  date: { type: Date, required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },

  maxPlayers: { type: Number, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  status: { 
    type: String, 
    enum: ["open", "full", "completed", "cancelled"], 
    default: "open" 
  },

  message : { type: String },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Match", matchSchema);
