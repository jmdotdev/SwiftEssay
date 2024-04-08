import express from "express"
import { getWriters, registerWriterController,loginUser,rateWriter,getWriterRatings, verifyUserToken, deleteWriter,getSingleWriter } from "../controllers/writerController.js";
export const writerRouter = express.Router();

writerRouter.post('/registerWriter',registerWriterController),
writerRouter.post('/login',loginUser)
writerRouter.get('/getWriters',getWriters)
writerRouter.post('/rateWriter',rateWriter)
writerRouter.get('/getWriterRatings',getWriterRatings)
writerRouter.post('/verifyToken',verifyUserToken)
writerRouter.delete('/deleteWriter/:id',deleteWriter)
writerRouter.get('/writer/:id',getSingleWriter)

