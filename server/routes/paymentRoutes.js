import express from 'express'
import { paymentSuccess, paymentCancel } from '../controllers/paypalController.js'
export const paymentRouter = express.Router();

paymentRouter.get('/success', paymentSuccess);
paymentRouter.get('/cancel', paymentCancel);

