import express from "express"
import { registerWriterController } from "../controllers/writerController.js";
export const writerRouter = express.Router();

writerRouter.post('/registerWriter',registerWriterController)