import mongoose, { mongo } from "mongoose";
const Schema = mongoose;


const MessageSchema = new Schema({

})
const Message = mongoose.model('Message',MessageSchema)
module.exports(Message)