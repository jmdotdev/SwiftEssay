import mongoose from "mongoose";
const Schema  = mongoose;

const orderSchema = new Schema({
  academic_level:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required:true
  },
  discipline:{
    type:String,
    required:true
  },
  topic:{
    type:String,
    required:true
  },
  instructions:{
    type:String,
    required:true
  },
  files:{
    type: [Buffer], // Buffer type for binary data (files)
    required:true,
  },
  page_format:{
    type:String,
    required:true,
  },
  pages:{
    type:Number,
    required:true,
  },
  single_or_double: {
    type:String,
    required: true,
  },
  citations:{
    type: Number,
    required: true,
    default:0,
  },
  slides:{
    type:Number,
    required:false,
    default: 0,
  },
  deadline:{
    type:Date,
    required:true,
  },
  assigned_to:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:false,
  },
  submitted_files:{
    type:[Buffer], //Buffer type for binary data (files)
    required:false,
  },
  submitted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: ()=>Date.now(),
  },
});

const Order = mongoose.model('Order',orderSchema);

module.exports(Order)
