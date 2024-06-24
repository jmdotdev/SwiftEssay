export const paymentSuccess = async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": "40.00" // You might want to dynamically set this based on your orderDetails
        }
      }]
    };
  
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
          res.status(201).json({ message: "Order created successfully", payment });
        } catch (err) {
          res.status(500).json({ error: err });
        }
      }
    });
  };
  
const paymentCancel = (req, res) => {
    res.status(200).json({ message: 'Payment cancelled' })
};
  