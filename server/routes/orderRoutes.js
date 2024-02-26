import express from "express"
import { createOrder,getOrders, getSingleOrder } from "../controllers/orderController.js";
import { uploadFiles } from "../middewares/multerMiddleware.js";
export const orderRouter = express.Router();

orderRouter.post('/createOrder',uploadFiles,createOrder)
orderRouter.get('/getOrders',getOrders)
orderRouter.get('/getSingleOrder/:id',getSingleOrder)