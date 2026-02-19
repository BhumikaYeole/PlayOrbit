import { Router } from "express";
import { createMatch, getMatchesByUserId, getAllMatches, leaveMatch, cancelMatch } from "../controllers/match_controller.js";
import authorize from "../middleware/auth_middleware.js";

const matchRouter = Router();

matchRouter.post("/", authorize, createMatch);
matchRouter.get("/my-matches", authorize, getMatchesByUserId); 
matchRouter.get("/all", getAllMatches)
matchRouter.post("/:matchId/leave", authorize, leaveMatch)
matchRouter.post("/:matchId/cancel", authorize, cancelMatch)


export default matchRouter;