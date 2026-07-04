const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    altText: { type: String, default: '' },
    link: { type: String, default: '/' },
    page: { type: String, enum: ['home', 'men', 'women', 'accessories'], default: 'home' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
