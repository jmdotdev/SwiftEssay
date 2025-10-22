import express from 'express'
// import { paymentSuccess, paymentCancel } from '../controllers/paypalController.js'
import { createPayment } from '../controllers/paymentController.js';
export const paymentRouter = express.Router();

paymentRouter.post('/', createPayment);
// paymentRouter.get('/success', paymentSuccess);
// paymentRouter.get('/cancel', paymentCancel);

