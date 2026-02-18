import mongoose from "mongoose";

const turfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  sport: { type: String, required: true },
  image : { type: String },

  totalSlots: { type: Number, required: true },
  availableSlots: { type: Number, required: true },

  pricePerHour: { type: Number, required: true },

  daysAvailable: [{ type: String }], 

  facilities: [{ type: String }],

  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  slots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Slot" }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Turf", turfSchema);
