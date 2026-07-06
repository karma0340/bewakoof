const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['flat', 'percent'], required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number, default: 1000 },
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  description: { type: String, default: '' },
  expiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
