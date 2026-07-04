const User = require('../models/User');
const Product = require('../models/Product');

// @GET /api/cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find(
      (i) => i.product.toString() === productId && i.size === size
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, size, quantity });
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (quantity <= 0) {
      user.cart.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/cart/:itemId
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart.pull(req.params.itemId);
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/cart (clear)
const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
