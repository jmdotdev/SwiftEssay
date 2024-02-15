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
