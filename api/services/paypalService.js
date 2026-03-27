

export const paymentSuccess = async (req, res,orderDetails,files) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": orderDetails.price
        }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
      if (error) {
        console.log(error.response);
        res.status(500).json({ error: 'Payment execution failed' });
      } else {
        try {
          // const orderDetails = req.body;
          // orderDetails.amount_payable = orderDetails.pages * 300;
  
          // const files = req.files["files"] || [];
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
  
  exports.paymentCancel = (req, res) => res.status(200).json({ message: 'Payment cancelled' });
  