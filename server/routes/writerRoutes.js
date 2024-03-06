import express from "express"
import { getWriters, registerWriterController,loginUser,rateWriter } from "../controllers/writerController.js";
export const writerRouter = express.Router();

writerRouter.post('/registerWriter',registerWriterController),
writerRouter.post('/login',loginUser)
writerRouter.get('/getWriters',getWriters)
writerRouter.post('/rateWriter',rateWriter)