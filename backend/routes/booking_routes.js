import express from "express";
import { createBooking, cancelBooking, getMyBookings, getProviderBookings } from "../controllers/booking_controller.js";
import authorize from "../middleware/auth_middleware.js";
import { allowProvider } from "../middleware/role_middleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/", authorize, createBooking);
bookingRouter.post("/:bookingId/cancel", authorize, cancelBooking);
bookingRouter.get("/", authorize, getMyBookings);
bookingRouter.get("/provider", authorize, allowProvider, getProviderBookings);

export default bookingRouter;
