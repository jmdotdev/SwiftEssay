const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const url = process.env.mongoDbUrl;


const connectDb = () => {
    mongoose.connect(url).then(() => {
        console.log("db connected");
    }).catch(err => console.log({"error": err}));
}

app.listen(PORT, () => {
  connectDb();
  console.log(`server running at port ${PORT}`);
});
