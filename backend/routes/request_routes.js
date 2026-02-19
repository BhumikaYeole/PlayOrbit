import { Router } from "express";
import { sendJoinRequest, getIncomingRequests, respondToRequest, getSentRequests } from "../controllers/request_controller.js";
import authorize from "../middleware/auth_middleware.js";

const requestRouter = Router();

requestRouter.post("/", authorize, sendJoinRequest);
requestRouter.get("/incoming", authorize, getIncomingRequests);
requestRouter.post("/:requestId/respond", authorize, respondToRequest);
requestRouter.get("/sent", authorize, getSentRequests)

export default requestRouter;