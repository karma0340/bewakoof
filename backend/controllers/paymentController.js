const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @POST /api/payment/create-order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay createOrder error:', err);
    res.status(500).json({ message: 'Payment initiation failed', error: err.message });
  }
};

// @POST /api/payment/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Create the order in DB
    const { items, shippingAddress, itemsPrice, shippingPrice, totalPrice, couponCode, discount } = orderData;
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      itemsPrice,
      shippingPrice: shippingPrice || 0,
      discount: discount || 0,
      couponCode: couponCode || '',
      totalPrice,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      statusHistory: [{ status: 'placed', note: 'Payment successful. Order placed.' }],
    });

    // Clear cart
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
