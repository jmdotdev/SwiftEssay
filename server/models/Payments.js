import mongoose from  "mongoose"
const Schema = mongoose;


const PaymentSchema= new Schema({

})

const Payment =  mongoose.model("Payment",PaymentSchema)
module.exports(Payment)