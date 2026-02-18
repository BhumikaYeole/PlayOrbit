import express from "express";
import { createTurf, getTurfSlotsByDate, getAllTurfs } from "../controllers/turf_controller.js";
import authorize from "../middleware/auth_middleware.js";

const turfRouter = express.Router();

turfRouter.post("/", authorize, createTurf);
turfRouter.get("/", getAllTurfs);   
turfRouter.get("/:turfId/slots", getTurfSlotsByDate);

export default turfRouter;
