import Booking from "../models/booking.js";
import Slot from "../models/slot.js";
import Turf from "../models/turf.js";

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { turfId, slotId } = req.body;

        // to prevent double booking
        const slot = await Slot.findOneAndUpdate(
            { _id: slotId, isAvailable: true },
            { isAvailable: false },
            { returnDocument: "after" }
        );

        if (!slot) {
            return res.status(400).json({ message: "Slot already booked" });
        }

        const slotDateTime = new Date(slot.date);
        const [hour] = slot.startTime.split(":");
        slotDateTime.setHours(hour);

        if (slotDateTime < new Date()) {
            return res.status(400).json({ message: "Cannot book past time slot" });
        }

        // Get turf
        const turf = await Turf.findById(turfId);

        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        // Create booking
        const booking = await Booking.create({
            user: userId,
            turf: turfId,
            slot: slotId,
            date: slot.date,
            totalPrice: slot.price,
            bookingStatus: "confirmed",
            paymentStatus: "pending"
        });

        //  Link slot to booking
        slot.bookedBy = booking._id;
        await slot.save();

        //  Update turf available slots count
        turf.availableSlots -= 1;
        await turf.save();

        res.status(201).json({
            message: "Booking successful",
            booking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const cancelBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { bookingId } = req.params;

        // Find booking
        const booking = await Booking.findById(bookingId).session(session);

        if (!booking) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.user.toString() !== userId) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (booking.bookingStatus === "cancelled") {
            await session.abortTransaction();
            return res.status(400).json({ message: "Already cancelled" });
        }

        booking.bookingStatus = "cancelled";
        await booking.save({ session });

        await Slot.findByIdAndUpdate(
            booking.slot,
            { isAvailable: true, bookedBy: null },
            { session }
        );

        await Turf.findByIdAndUpdate(
            booking.turf,
            { $inc: { availableSlots: 1 } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Booking cancelled successfully" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ user: userId })
            .populate("turf", "name location")
            .populate("slot", "startTime endTime date")
            .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getProviderBookings = async (req, res) => {
    try {
        const providerId = req.user.id;

        const bookings = await Booking.find()
            .populate({
                path: "turf",
                match: { provider: providerId }
            })
            .populate("user", "name email")
            .populate("slot", "startTime endTime date");

        const filtered = bookings.filter(b => b.turf !== null);

        res.json(filtered);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

