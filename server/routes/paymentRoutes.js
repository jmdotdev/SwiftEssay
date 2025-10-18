import express from 'express'
import { paymentSuccess, paymentCancel } from '../controllers/paypalController.js'
import { createPayment } from '../controllers/payment.controller.js';
export const paymentRouter = express.Router();

router.post('/', createPayment);
// paymentRouter.get('/success', paymentSuccess);
// paymentRouter.get('/cancel', paymentCancel);

