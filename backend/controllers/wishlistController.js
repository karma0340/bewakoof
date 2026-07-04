const User = require('../models/User');

// @POST /api/wishlist/:productId  (toggle)
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const idx = user.wishlist.findIndex((id) => id.toString() === productId);
    let added;
    if (idx === -1) {
      user.wishlist.push(productId);
      added = true;
    } else {
      user.wishlist.splice(idx, 1);
      added = false;
    }
    await user.save();
    res.json({ wishlist: user.wishlist, added });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { toggleWishlist, getWishlist };
