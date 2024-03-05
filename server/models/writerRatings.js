import mongoose, { Schema } from "mongoose";

const writerRatingSchema = new Schema({
    writer:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    task:{
        type:mongoose.Types.ObjectId,
        ref:'Order',
        required:true,
        rated:Boolean,
    },
    rating:{
      type:Number,
      required:true
    },
    rated: {
        type: Boolean,
        default: false
    },
    
})
const writerRating = mongoose.model('WriterRating', writerRatingSchema);

export default writerRating;