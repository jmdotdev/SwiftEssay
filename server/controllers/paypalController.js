export const paymentSuccess = async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const order = req.session.order;
    if (!order) {
      throw new Error("Order not found in session");
    }
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: order.amount_payable.toFixed(2), // You might want to dynamically set this based on your orderDetails
          },
        },
      ],
    };
<<<<<<< HEAD

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log("Error executing payment:", error.response);
          res.status(500).json({ error: "Payment execution failed" });
        } else {
          try {
            console.log("Payment executed successfully:", payment);
            req.session.order = null;
            res
              .status(201)
              .json({ message: "Order created successfully", payment });
          } catch (err) {
            console.error("Error saving order:", err);
            res.status(500).json({ error: "Order saving failed" });
          }
=======
  
    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
      if (error) {
        console.log(error.response);
        res.status(500).json({ error: 'Payment execution failed' });
      } else {
        try {
          const orderDetails = req.body; // You might want to use sessions or another way to store and retrieve order details
          orderDetails.amount_payable = orderDetails.pages * 300;
  
          const files = req.files["files"] || [];
          const order = new Order({
            ...orderDetails,
            files: files.map((file) => file),
          });
  
          await order.save();
          req.session.order = null; 
          res.status(201).json({ message: "Order created successfully", payment });
        } catch (err) {
          res.status(500).json({ error: err });
>>>>>>> 515757710647572ccd5cd79986269221dc65af17
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const paymentCancel = (req, res) => {
  res.status(500).json({ message: "Payment cancelled" });
};
