import { registrationAuth } from "../validators/validators.js";
import { formatJOIError } from "../helpers/formatJoiError.js";
import User from '../models/Writer.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const registerClientController = async (req, res) => {
  try {
     const{ username, email, password } = await registrationAuth.validateAsync(req.body)
     const isUserFound = await User.findOne({email: email})
     if(isUserFound) {
        return res.status(400).json({ error: "User with this email exists" });
     }
     const hashedPassword = await bcrypt.hash(password,10)
     const user = new User({
        username,
        email,
        password:hashedPassword,
        role:"client"
     })
     await user.save()
     return res.status(200).json({ message: "User Created Successfully" })
  } catch (err) {
    if(err.isJoi) {
      const error = formatJOIError(err);
       return res.status(400).json({ error: error});
    }
    res.status(500).json({ error: err.message });
  }
};
