import express from 'express'
import paymentController from '../controllers/paypalController'
const paymentRouter = express.Router();


router.get('/success', paymentController.paymentSuccess);
router.get('/cancel', paymentController.paymentCancel);

module.exports = router;
