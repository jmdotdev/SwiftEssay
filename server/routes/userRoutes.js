import express from "express"
import { registerUserController } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.post('/registerUser',registerUserController)