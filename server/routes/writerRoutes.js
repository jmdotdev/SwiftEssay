import express from "express"
import { getWriters, registerWriterController } from "../controllers/writerController.js";
export const writerRouter = express.Router();

writerRouter.post('/registerWriter',registerWriterController),
writerRouter.get('/getWriters',getWriters)