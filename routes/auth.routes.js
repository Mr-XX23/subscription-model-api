import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controllers.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp)

authRouter.post('/sign-in', signIn)

authRouter.get('/sign-out', authorize, signOut)

export default authRouter;