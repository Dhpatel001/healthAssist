const Razorpay = require('razorpay');
const crypto = require('crypto');
const bodyParser = require("body-parser");
const Payment = require('../models/PaymentModel');
const Appointment = require('../models/AppointmentModel');



const razorpay = new Razorpay({
  key_id: "rzp_test_BJfA9tfictA1Jg",
  key_secret: "gqPxhZ4gfiTLhPawXOLTMJA0",
});
// exports.createOrder = async (req, res) => {
//   try {
//     // Destructure and validate request body
//     const { amount, currency = 'INR', receipt } = req.body;

//     if (!amount || isNaN(amount)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid amount is required'
//       });
//     }

//     const options = {
//       amount: Math.round(Number(amount) * 100), // Convert to paise
//       currency,
//       receipt: receipt || `receipt_${Date.now()}`,
//       payment_capture: 1
//     };

//     const order = await razorpay.orders.create(options);
//     console.log("Razorpay Order Response:", response.data);
//     res.status(200).json({
//       success: true,
//       order
//     });
//   } catch (error) {
//     console.error('Payment Error:', {
//       message: error.message,
//       statusCode: error.statusCode,
//       error: error.error,
//       stack: error.stack
//     });
    
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.error?.description || 'Failed to create payment order',
//       error: error.error || error.message
//     });
//   }
// };

// API to create an order
const create_order = async (req, res) => {
  const { amount, currency, receipt } = req.body;
  
  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: receipt,
    payment_capture: 1 // Add this line to enable auto-capture
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// API to verify the payment signature (optional for backend verification)
const verify_order = async (req, res) => {
  const crypto = require("crypto");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = "1YJr64YQjSz8F09ADdcsIo2x";

  const hash = crypto.createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  console.log(hash, razorpay_signature);
  if (hash === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failure" });
  }
};

const capture_payment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    
    const payment = await razorpay.payments.capture(
      paymentId,
      amount * 100 // amount in paise
    );
    
    // Update your database
    await Payment.findOneAndUpdate(
      { paymentId },
      { status: 'captured' }
    );
    
    res.json({ success: true, payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
    create_order,
    verify_order,
    capture_payment,
}