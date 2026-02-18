import Turf from "../models/turf.js";
import Slot from "../models/slot.js";
import ProviderProfile from "../models/provider_profile.js";

// Helper function to generate slots
const generateSlotsForDays = async (turfId, pricePerHour) => {
  const slots = [];
  const today = new Date();

  // Generate for next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() + day);

    // Example: 6 AM to 10 PM (1 hour slots)
    for (let hour = 6; hour < 22; hour++) {
      const startTime = `${hour}:00`;
      const endTime = `${hour + 1}:00`;

      slots.push({
        turf: turfId,
        date: new Date(currentDate),
        startTime,
        endTime,
        isAvailable: true,
        price: pricePerHour
      });
    }
  }

  return await Slot.insertMany(slots);
};

export const createTurf = async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log("User ID from token:", userId);
 
    const provider = await ProviderProfile.findOne({ user: userId });
    console.log("Provider profile found:", provider);

    if (!provider) {
      return res.status(403).json({ message: "Only providers can create turfs" });
    }

    const {
      name,
      location,
      sport,
      totalSlots,
      pricePerHour,
      daysAvailable,
      facilities
    } = req.body;


    const turf = await Turf.create({
      name,
      location,
      sport,
      totalSlots,
      availableSlots: totalSlots,
      pricePerHour,
      daysAvailable,
      facilities,
      provider: userId
    });


    const generatedSlots = await generateSlotsForDays(
      turf._id,
      pricePerHour
    );

    // Attach slot IDs to turf
    turf.slots = generatedSlots.map(slot => slot._id);
    await turf.save();

    // Add turf to provider profile
    provider.turfsAdded.push(turf._id);
    await provider.save();

    res.status(201).json({
      message: "Turf created successfully",
      turf
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getTurfSlotsByDate = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const selectedDate = new Date(date);

    const slots = await Slot.find({
      turf: turfId,
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      }
    });

    res.json(slots);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find().populate("provider", "name email");     
    res.json(turfs);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


