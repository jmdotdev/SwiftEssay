import User from '../models/Writer.js'

export const getUserById = async (req,res) => {
    try {
      const id = req.params.id;
      console.log(id)
      const user = await User.findById(id);
      const payload = {
        username:user.username,
        email:user.email,
        role:user.role
      }
      console.log(payload)
      return res.status(200).json(payload)
    } catch (error) {
      return res.status(403).json({ message: error });
    }
  }