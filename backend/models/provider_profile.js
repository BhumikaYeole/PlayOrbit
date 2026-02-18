import mongoose from "mongoose";

const providerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  contactNumber: { type: String },
  address: { type: String },

  turfsAdded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Turf" }],

  pendingBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  confirmedBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],

  totalRevenue: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ProviderProfile", providerProfileSchema);
