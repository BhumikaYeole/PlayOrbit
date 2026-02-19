import express from "express";
import { createTurf, getTurfSlotsByDate, getAllTurfs, getTurfByUserId } from "../controllers/turf_controller.js";
import authorize from "../middleware/auth_middleware.js";

const turfRouter = express.Router();

turfRouter.post("/", authorize, createTurf);
turfRouter.get("/", authorize, getTurfByUserId);
turfRouter.get("/all", getAllTurfs);   
turfRouter.get("/:turfId/slots", getTurfSlotsByDate);

export default turfRouter;
