import mongoose from "mongoose";
const {Schema} = mongoose;


const MessageSchema = new Schema({
    to:{
        type:String,
        required:true
    },
    from:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    is_read:{
        type:Boolean,
        default:false
    },
    sent_on:{
        type:Date,
        default:() => Date.now()
    }
})
const Message = mongoose.model('Message',MessageSchema)
export default Message