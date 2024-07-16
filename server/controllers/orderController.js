import Order from "../models/Order.js";
import paypal from 'paypal-rest-sdk'
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
  });


  export const createOrder = async (req, res) => {
    try {
      const orderDetails = req.body;
      orderDetails.amount_payable = orderDetails.pages * 300;
  
      const files = req.files["files"] || [];
  
      const order = new Order({
        ...orderDetails,
        files: files.map((file) => file),
      });
  
      // Save order to the database
      await order.save();
      req.session.order = order;
  
      console.log("Order saved:", order);
  
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:5000/payment/success",
          cancel_url: "http://localhost:5000/payment/cancel",
        },
        transactions: [
          {
            amount: {
              currency: "USD",
              total: orderDetails.amount_payable.toFixed(2),
            },
            description: `Order ${order.id} payment`,
          },
        ],
      };
  
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          console.log("Error creating payment:", error);
          res.status(500).json({ error: "Payment creation failed" });
        } else {
          console.log("Payment created successfully:", payment);
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              return res.json({redirectionLink: payment.links[i].href});
            }
          }
          res.status(500).json({ error: "No approval URL found" });
        }
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Order creation failed" });
    }
  };

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("assigned_to");
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
      .populate("assigned_to")
      .populate("posted_by");

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
      { assigned_to: writer, status: "progress" }
      // To get the updated document
      // { new: true }
    );
    return res.status(200).json({ message: "order updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const orderDetails = req.body;
    if (!orderDetails.pages || typeof orderDetails.pages !== "number") {
      return res.status(400).json({ error: "Invalid number of pages" });
    }

    orderDetails.amount_payable = orderDetails.pages * 300;

    // Extract uploaded files from request
    const files = req.files?.files || [];

    // Add files to orderDetails
    orderDetails.files = files.map((file) => file);

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, orderDetails, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ message: "order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
