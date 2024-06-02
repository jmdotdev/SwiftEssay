import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const orderDetails = req.body;
    orderDetails.amount_payable = orderDetails.pages * 300

    // Extract uploaded files from request
    const files = req.files["files"] || [];

    // Construct order object with file data
    const order = new Order({
      ...orderDetails,
      files: files.map((file) => file), 
    });
    // Save order to the database
    await order.save();

    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("assigned_to")
      // .populate("submitted_by");
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
    .populate("assigned_to").populate("posted_by")

    // .populate("submitted_by");
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const assignOrder = async (req, res) => {
  try {
      const id = req.params.id;
      const writer = req.body;
      await Order.findByIdAndUpdate(
        id,
        { assigned_to: writer },
        // To get the updated document
        // { new: true }
      );
      return res.status(200).json({ message: "order updated successfully" }); 
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};


export const deleteOrder = async (req,res) => {
   try {
    const id = req.params.id;
    await Order.findByIdAndDelete(id)
    return res.status(200).json({message: "order deleted successfully"})
   } catch (error) {
    return res.status(500).json({error: error})
   }
}