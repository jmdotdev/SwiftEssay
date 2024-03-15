import Message from "../models/Messages.js";
import User from '../models/Writer.js'
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


export const getInAppMessages = async (req,res) =>{
  try {
   const appmessages = await Message.find();
   const payload = await Promise.all(
      appmessages.map(async(am)=>{
         const sent_to = await User.findById(am.to)
         const from = await User.findById(am.from)
         const message = am.message
         const is_read = am.is_read
         const sent_on = am.sent_on


         return{
            sent_to:sent_to.username,
            from:from.username,
            message,
            is_read,
            sent_on
         }
      })
   )
   res.status(200).json({payload})
  } catch (error) {
   res.status(500).json({error:error})
  }
}

export const getUserInAppmessages = async (req,res) =>{
   try {
      const user_id = req.body;
      const userMessages = await Message.find().where(to == user_id);
      const payload = await Promise.all(
         userMessages.map(async(am)=>{
            const sent_to = await User.findById(am.to)
            const from = await User.findById(am.from)
            const message = am.message
            const is_read = am.is_read
            const sent_on = am.sent_on
   
   
            return{
               sent_to:sent_to.username,
               from:from.username,
               message,
               is_read,
               sent_on
            }
         })
      )
      res.status(200).json({payload})
   } catch (error) {
      res.status(500).json({error:error})
   }
}