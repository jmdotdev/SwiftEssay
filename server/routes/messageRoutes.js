import { Router } from "express";
import { sendInAppMessage } from "../controllers/messageController.js";

export const messageRouter = Router();


messageRouter.post('/sendMessage',sendInAppMessage)