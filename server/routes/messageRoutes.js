import { Router } from "express";
import { getInAppMessages, getUserInAppmessages, sendInAppMessage } from "../controllers/messageController.js";

export const messageRouter = Router();


messageRouter.post('/sendMessage',sendInAppMessage)
messageRouter.get('/getMessages',getInAppMessages)
messageRouter.get('/getUserMessages',getUserInAppmessages)