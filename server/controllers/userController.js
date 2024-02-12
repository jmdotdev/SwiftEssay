import { registrationAuth } from "../helpers/joiauth.js";
import User from '../models/Writer.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const registerUserController = async (req, res) => {
  try {
     const{username,email,password} = req.body
     const [error] = registrationAuth.validate(req.body)
     if(error){
        return res.status(404).json({error:error})
     }
     const hashedPassword = bcrypt.hash(password,10)
     const user = new User({
        username,
        email,
        hashedPassword,
        role:"client"
     })
     await user.save()
     return res.status(200).json({message:"Writer Created Successfully"})
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
