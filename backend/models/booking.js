import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },

  date: { type: Date, required: true },

  totalPrice: { type: Number, required: true },

  bookingStatus: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  },

  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "refunded"], 
    default: "pending" 
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);
