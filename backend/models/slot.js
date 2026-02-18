import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: true },

  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  isAvailable: { type: Boolean, default: true },

  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },

  price: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Slot", slotSchema);
