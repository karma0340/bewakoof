const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        image: String,
        size: String,
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMethod: { type: String, default: 'mock' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    itemsPrice: Number,
    shippingPrice: { type: Number, default: 0 },
    totalPrice: Number,
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    deliveredAt: Date,
    estimatedDelivery: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
