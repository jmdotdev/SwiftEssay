import Payment from '../models/Payment.js'
export const createPayment = async (req, res) => {
  try {
    const {
      order,
      user,
      paymentCode,
      amount,
      currency,
      method,
      status,
      paidAt,
    } = req.body;

    // Basic validation
    if (!order || !user || !paymentCode || !amount) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const payment = new Payment({
      order,
      user,
      paymentCode,
      amount,
      currency,
      method,
      status,
      paidAt: paidAt || new Date(),
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment recorded successfully.',
      payment,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // Duplicate paymentCode
      return res.status(400).json({ message: 'Payment code already exists.' });
    }
    res.status(500).json({ message: 'Error recording payment.', error });
  }
};
