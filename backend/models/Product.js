const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: 'Bewakoof' },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        't-shirt','shirt','hoodie','sweatshirt','joggers','trackpants',
        'shorts','jeans','cargo','jacket','kurta','co-ord-set',
        'bag','cap','wallet','socks','phone-case','bottle','watch','other'
      ],
    },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    subCategory: { type: String, default: '' },
    fit: { type: String, enum: ['oversized','regular','straight','slim','relaxed',''], default: '' },
    images: [{ type: String }],
    sizes: [
      {
        size: { type: String, enum: ['XS','S','M','L','XL','XXL','3XL','Free Size'] },
        stock: { type: Number, default: 0 },
      },
    ],
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    color: { type: String, default: '' },
    colors: [{ type: String }],
    pattern: {
      type: String,
      enum: ['graphic','solid','striped','printed','checkered','abstract','typography',''],
      default: '',
    },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    collaboration: { type: String, default: '' },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for full-text search
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  category: 'text',
  collaboration: 'text',
});

productSchema.index({ gender: 1, category: 1, price: 1, rating: -1 });

module.exports = mongoose.model('Product', productSchema);
