import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { clientRouter } from "./routes/clientRoutes.js";
import { writerRouter } from "./routes/writerRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { messageRouter } from "./routes/messageRoutes.js";
const app = express()
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const url = process.env.mongoDbUrl;

const connectDb = () => {
    mongoose.connect(url).then(() => {
        console.log("db connected");
    }).catch(err => console.log({"error": err}));
}


app.use('/clients',clientRouter)
app.use('/writers',writerRouter)
app.use('/orders',orderRouter)
app.use('/messages',messageRouter)

app.listen(PORT, () => {
  connectDb();
  console.log(`server running at port ${PORT}`);
});
