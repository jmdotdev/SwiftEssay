import mongoose from "mongoose";
const {Schema}  = mongoose;

const orderSchema = new Schema({
  order_id:{
    type:Number,
    default: Math.ceil(Math.random() * 1000)
  },
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
    type: [],
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
  amount_payable:{
   type: Number,
   required: true
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
  posted_by:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:false,
  },
  assigned_to:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:false,
  },
  submitted_files:{
    type: [],
    required:false,
  },
  status:{
    type:String,
    enum:["available","assigned","completed","revision","progress","cancelled"],
    default:"available"
  },
  revision_comment :{
    type:String,
    required:false
  },
  cancel_comment:{
    type:String,
    required:false
  },
  isPaid:{
     type: Boolean,
     default: false
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

export default Order
