import mongoose, { Schema } from "mongoose";

const writerRatingSchema = new Schema({
    writer_id:{
        type:String,
        required:true
    },
    task_id:{
        type:String,
        required:true
    },
    rating:{
      type:Number,
      required:true,
      min:0,
      max:5
    },
    rated: {
        type: Boolean,
        default: false
    },
    comments:{
        type:String,
        required:false,
    }
    
})
const WriterRating = mongoose.model('WriterRating', writerRatingSchema);

export default WriterRating;