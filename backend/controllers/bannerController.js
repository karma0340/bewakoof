const Banner = require('../models/Banner');

const getBanners = async (req, res) => {
  try {
    const { page } = req.query;
    const filter = { isActive: true };
    if (page) filter.page = page;
    const banners = await Banner.find(filter).sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBanners };
