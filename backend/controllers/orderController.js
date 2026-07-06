const Order = require('../models/Order');
const User = require('../models/User');

// @POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in order' });

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      itemsPrice,
      shippingPrice: shippingPrice || 0,
      totalPrice,
      paymentStatus: 'paid',
      statusHistory: [{ status: 'placed', note: 'Order placed successfully' }],
    });

    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (!['placed', 'confirmed'].includes(order.status))
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });

    order.status = 'cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by user';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by user' });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, cancelOrder };
