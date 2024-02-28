import { registrationAuth } from "../helpers/joiauth.js";
import User from '../models/Writer.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const registerWriterController = async (req, res) => {
  try {
     const{username,email,phone,password} = req.body
   //   const [error] = registrationAuth.validateAsync(req.body)
   //   if(error){
   //      return res.status(404).json({error:error.details.message})
   //   }
     const hashedPassword = await bcrypt.hash(password,10)
     const user = new User({
        username,
        email,
        phone,
        password:hashedPassword,
        role:"writer"
     })
     await user.save()
     return res.status(200).json({message:"Writer Created Successfully"})
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


export const getWriters = async (req,res) =>{
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (err) {
    res.status(500).json({error:err})
  }
}

export const loginUser = async (req,res) =>{
  try{
     const{email,password} = req.body
     const user = await User.findOne({email})
     if(!user){
       res.status(401).json({ error: 'Authentication failed' });
     }
     const passwordMatch = await bcrypt.compare(password,user.password);
     if(!passwordMatch){
      res.status(401).json({ error: 'Authentication failed' });
     }
     const payload={
      userId:user._id,
      username:user.username,
      email:user.email,
      assigned_tasks:user.assigned_tasks,
      is_assigned:user.is_assigned,
      posted_jobs:user.posted_jobs,
      role:user.role
     }
     const token = jwt.sign({payload},"mysecretkey",{
      expiresIn:"1h"
     });
     res.status(200).json({token,user:payload})
  }
  catch (err) {
    res.status(500).json({error:err})
  }
}