import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path'
import { fileURLToPath } from 'url';
import { clientRouter } from "./routes/clientRoutes.js";
import { writerRouter } from "./routes/writerRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
const app = express()
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const url = process.env.mongoDbUrl;
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const connectDb = () => {
    mongoose.connect(url).then(() => {
        console.log("db connected");
    }).catch(err => console.log({"error": err}));
}
// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use('/users',userRouter)
app.use('/clients',clientRouter)
app.use('/writers',writerRouter)
app.use('/orders',orderRouter)
// Serve static files from the 'orderfiles' directory
app.use('/orderfiles', express.static(path.join(__dirname, 'orderfiles')));

app.listen(PORT, () => {
  connectDb();
  console.log(`server running at port ${PORT}`);
});
