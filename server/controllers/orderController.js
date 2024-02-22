import Order from '../models/Order.js'


export const createOrder = async (req, res) => {
  try {
    const orderDetails = req.body;

    // Extract uploaded files from request
    const files = req.files['files'] || [];
    // const submittedFiles = req.files['submitted_files'] || [];

    // Construct order object with file data
    const order = new Order({
      ...orderDetails,
      files: files.map(file => file.buffer), // Store file buffers in the database
      submitted_files: submittedFiles.map(file => file.buffer), // Store file buffers in the database
    });
    console.log("backend",orderDetails)
    // Save order to the database
    await order.save();

    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.log("backend",orderDetails)
    console.error('Error creating order:', error);
    res.status(500).json({ error: error });
  }
};

