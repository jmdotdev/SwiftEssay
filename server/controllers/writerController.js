import { registrationAuth } from "../helpers/joiauth.js";
import User from "../models/Writer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import WriterRating from "../models/writerRatings.js";
import { verifyToken } from "../helpers/verifyToken.js";
import Order from "../models/Order.js";
import { sendEmail } from "../services/sendEmail.js";
export const registerWriterController = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    //   const [error] = registrationAuth.validateAsync(req.body)
    //   if(error){
    //      return res.status(404).json({error:error.details.message})
    //   }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      role: "writer",
    });
    const recipient = email;
    await sendEmail(recipient,username)
    await user.save();
    return res.status(200).json({ message: "Writer Created Successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getWriters = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      assigned_tasks: user.assigned_tasks,
      is_assigned: user.is_assigned,
      posted_jobs: user.posted_jobs,
      role: user.role,
    };
    const token = jwt.sign({ payload }, "mysecretkey", {
      expiresIn: "1h",
    });
    return res.status(200).json({ token, payload });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const rateWriter = async (req, res) => {
  try {
    const { writer_id, task_id, rating, comment } = req.body;
    const writeRating = new WriterRating({
      writer_id,
      task_id,
      rating,
      rated: true,
      comment,
    });
    await writeRating.save();
    return res.status(201).json({ message: "rating added successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getWriterRatings = async (req, res) => {
  try {
    const writerRatings = await WriterRating.find();
    const payload = await Promise.all(
      writerRatings.map(async (wr) => {
        const writer = await User.findById(wr.writer_id);
        const task = await Order.findById(wr.task_id);
        const rating = wr.rating;
        const rated = wr.rated;

        return {
          writer: writer.username,
          task: task.topic,
          rating,
          rated,
        };
      })
    );

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const verifyUserToken = async (req, res) => {
  const token = req.body.token || req.headers.authorization.split(" ")[1];
  try {
    const result = await verifyToken(token);
    return res.json(result);
  } catch (error) {
    return res.status(403).json({ message: error });
  }
};

export const deleteWriter = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "writer not found" });
  }
  await User.findOneAndDelete(user);
  return res.status(200).json({ message: "writer deleted successfully" });
};

export const getSingleWriter = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    const assignedOrders = await Order.find({assigned_to: user._id})
    user.assigned_tasks = assignedOrders;
    if (!user) {
      return res.status(404).json({ message: "writer not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
