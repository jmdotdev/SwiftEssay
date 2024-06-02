import express from "express"
import { createOrder,getOrders, getSingleOrder,assignOrder,deleteOrder } from "../controllers/orderController.js";
import { uploadFiles } from "../middewares/multerMiddleware.js";
import { verifyToken } from "../middewares/authMiddleware.js";
export const orderRouter = express.Router();

orderRouter.get('/getSingleOrder/:id',getSingleOrder);
orderRouter.patch('/assignOrder/:id',assignOrder);
orderRouter.delete('/deleteOrder/:id',deleteOrder)
orderRouter.post('/createOrder',uploadFiles,createOrder);
orderRouter.get('/getOrders',getOrders);