import Message from "../models/Messages.js";

export const sendInAppMessage = async (req,res) =>{
   try {
    const {to,from,message} = req.body;
    const inAppMessage = new Message({
     to,
     from,
     message,
     is_read:false
    })
 
    await inAppMessage.save()
    res.status(201).json({message:"message sent successfully"})
   } catch (error) {
    res.status(500).json({error:error})
   }
}