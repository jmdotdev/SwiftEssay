import express from "express"
import { createOrder } from "../controllers/orderController.js";
import { uploadFiles } from "../middewares/multerMiddleware.js";
export const orderRouter = express.Router();

orderRouter.post('/createOrder',uploadFiles,createOrder)