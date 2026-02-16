import { Router } from "express";
import { signIn, signUpProvider, signUpPlayer } from "../controllers/auth_controller.js";

const authRouter = Router()

authRouter.post("/sign-up/provider", signUpProvider)
authRouter.post("/sign-up/player", signUpPlayer)
authRouter.post("/sign-in", signIn)

export default authRouter