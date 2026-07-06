const User = require('../models/User');
const Coupon = require('../models/Coupon');

// @GET /api/users/me
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -cart -wishlist');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/users/me/addresses
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/users/me/addresses
const addAddress = async (req, res) => {
  try {
    const { name, phone, street, city, state, pincode, type, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push({ name, phone, street, city, state, pincode, type: type || 'home', isDefault: isDefault || user.addresses.length === 0 });
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/users/me/addresses/:addrId
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addrId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    if (req.body.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    Object.assign(addr, req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/users/me/addresses/:addrId
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addrId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });
    
    addr.deleteOne();
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/coupons/validate?code=
const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.query;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }
    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    if (coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already used this coupon' });
    }
    if (amount && Number(amount) < coupon.minOrder) {
      return res.status(400).json({ message: `Minimum order of ₹${coupon.minOrder} required` });
    }

    let discount = 0;
    if (coupon.discountType === 'flat') {
      discount = coupon.value;
    } else {
      discount = Math.round((Number(amount) * coupon.value) / 100);
    }

    res.json({ valid: true, discount, coupon: { code: coupon.code, type: coupon.discountType, value: coupon.value, description: coupon.description } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, getAddresses, addAddress, updateAddress, deleteAddress, validateCoupon };
