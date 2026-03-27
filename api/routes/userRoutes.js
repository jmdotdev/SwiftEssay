import express from "express"
import { getUserById } from "../controllers/userController.js";
export const userRouter = express.Router();


userRouter.get('/user/:id',getUserById)

