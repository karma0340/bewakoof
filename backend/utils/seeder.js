require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const connectDB = require('../config/db');

const menProducts = [
  // T-SHIRTS
  {
    name: 'Hangin Astronaut Oversized T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'men', fit: 'oversized',
    price: 499, originalPrice: 799, discountPercent: 38, rating: 4.7, ratingCount: 1420,
    collaboration: 'Space', pattern: 'graphic', color: 'black', colors: ['black', 'navy'],
    images: ['https://images.bewakoof.com/t640/men-s-black-hangin-astronaut-graphic-printed-oversized-t-shirt-504166-1741325888-1.jpg'],
    tags: ['astronaut', 'space', 'oversized', 'graphic'],
    sizes: [{size:'S',stock:10},{size:'M',stock:20},{size:'L',stock:15},{size:'XL',stock:8},{size:'XXL',stock:5}],
    isFeatured: true, isTrending: true
  },
  {
    name: 'Brick Red Magar Much Graphic T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'men', fit: 'regular',
    price: 399, originalPrice: 649, discountPercent: 38, rating: 4.5, ratingCount: 980,
    pattern: 'graphic', color: 'red', colors: ['red', 'black'],
    images: ['https://images.bewakoof.com/t640/men-s-brick-red-magar-much-graphic-printed-t-shirt-677649-1746769064-1.jpg'],
    tags: ['humor', 'graphic', 'funky'],
    sizes: [{size:'S',stock:8},{size:'M',stock:18},{size:'L',stock:12},{size:'XL',stock:6}],
    isFeatured: true
  },
  {
    name: 'Blue Seek Balance Oversized T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'men', fit: 'oversized',
    price: 549, originalPrice: 899, discountPercent: 39, rating: 4.8, ratingCount: 1756,
    pattern: 'graphic', color: 'blue', colors: ['blue', 'black'],
    images: ['https://images.bewakoof.com/t640/men-s-blue-seek-balance-graphic-printed-oversized-t-shirt-580211-1734699031-1.jpg'],
    tags: ['balance', 'zen', 'oversized'],
    sizes: [{size:'S',stock:5},{size:'M',stock:15},{size:'L',stock:10},{size:'XL',stock:4}],
    isTrending: true
  },
  {
    name: 'Grey Uncharted Graphic Printed T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'men', fit: 'regular',
    price: 449, originalPrice: 699, discountPercent: 36, rating: 4.6, ratingCount: 843,
    pattern: 'graphic', color: 'grey', colors: ['grey', 'black'],
    images: ['https://images.bewakoof.com/t640/men-s-grey-uncharted-graphic-printed-t-shirt-685571-1755163388-1.jpg'],
    tags: ['uncharted', 'adventure', 'attitude'],
    sizes: [{size:'S',stock:10},{size:'M',stock:25},{size:'L',stock:20},{size:'XL',stock:10}],
    isFeatured: true
  },
  {
    name: 'White Into The Wild T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'men', fit: 'regular',
    price: 429, originalPrice: 749, discountPercent: 42, rating: 4.4, ratingCount: 654,
    pattern: 'graphic', color: 'white', colors: ['white', 'black'],
    images: ['https://images.bewakoof.com/t640/men-s-white-into-the-wild-graphic-printed-t-shirt-689723-1758263491-1.jpg'],
    tags: ['wild', 'nature', 'printed'],
    sizes: [{size:'S',stock:12},{size:'M',stock:22},{size:'L',stock:18},{size:'XL',stock:9}],
    isTrending: true
  },
  {
    name: 'Black Leader Typography T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'men', fit: 'regular',
    price: 399, originalPrice: 699, discountPercent: 43, rating: 4.8, ratingCount: 2100,
    pattern: 'typography', color: 'black', colors: ['black'],
    images: ['https://images.bewakoof.com/t640/men-s-black-leader-typography-t-shirt-296653-1764335348-1.jpg'],
    tags: ['leader', 'typography', 'black'],
    sizes: [{size:'S',stock:15},{size:'M',stock:30},{size:'L',stock:25},{size:'XL',stock:15}],
    isFeatured: true
  },
  {
    name: 'One Piece Luffy Oversized Hoodie',
    brand: 'Bewakoof', category: 'hoodie', gender: 'men', fit: 'oversized',
    price: 999, originalPrice: 1499, discountPercent: 33, rating: 4.7, ratingCount: 823,
    collaboration: 'One Piece', pattern: 'graphic', color: 'black', colors: ['black', 'yellow'],
    images: ['https://images.bewakoof.com/t640/men-s-black-hangin-astronaut-graphic-printed-oversized-t-shirt-504166-1741325888-1.jpg'],
    tags: ['luffy', 'one piece', 'anime', 'hoodie'],
    sizes: [{size:'S',stock:8},{size:'M',stock:15},{size:'L',stock:12},{size:'XL',stock:5}],
    isFeatured: true, isTrending: true
  },
  {
    name: 'Batman Dark Knight Hoodie',
    brand: 'Bewakoof', category: 'hoodie', gender: 'men', fit: 'regular',
    price: 899, originalPrice: 1399, discountPercent: 36, rating: 4.4, ratingCount: 612,
    collaboration: 'DC', pattern: 'graphic', color: 'black', colors: ['black'],
    images: ['https://images.bewakoof.com/t640/men-s-grey-uncharted-graphic-printed-t-shirt-685571-1755163388-1.jpg'],
    tags: ['batman', 'dc', 'hoodie', 'superhero'],
    sizes: [{size:'S',stock:6},{size:'M',stock:14},{size:'L',stock:10},{size:'XL',stock:4}]
  },
];

const womenProducts = [
  {
    name: 'Coffee Typography Oversized T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'women', fit: 'oversized',
    price: 449, originalPrice: 749, discountPercent: 40, rating: 4.5, ratingCount: 876,
    pattern: 'graphic', color: 'beige', colors: ['beige', 'white'],
    images: ['https://images.bewakoof.com/t640/men-s-blue-seek-balance-graphic-printed-oversized-t-shirt-580211-1734699031-1.jpg'],
    tags: ['coffee', 'typography', 'oversized', 'casual'],
    sizes: [{size:'XS',stock:8},{size:'S',stock:15},{size:'M',stock:20},{size:'L',stock:12}],
    isFeatured: true, isTrending: true
  },
  {
    name: 'Brick Red Graphic Print T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'women', fit: 'regular',
    price: 399, originalPrice: 649, discountPercent: 39, rating: 4.3, ratingCount: 654,
    pattern: 'graphic', color: 'red', colors: ['red', 'white'],
    images: ['https://images.bewakoof.com/t640/men-s-brick-red-magar-much-graphic-printed-t-shirt-677649-1746769064-1.jpg'],
    tags: ['graphic', 'red', 'cute'],
    sizes: [{size:'XS',stock:6},{size:'S',stock:12},{size:'M',stock:18},{size:'L',stock:9}],
    isFeatured: true
  },
  {
    name: 'Oversized White Graphic Top',
    brand: 'Bewakoof', category: 't-shirt', gender: 'women', fit: 'oversized',
    price: 429, originalPrice: 699, discountPercent: 38, rating: 4.6, ratingCount: 1234,
    pattern: 'graphic', color: 'white', colors: ['white', 'pink'],
    images: ['https://images.bewakoof.com/t640/men-s-white-into-the-wild-graphic-printed-t-shirt-689723-1758263491-1.jpg'],
    tags: ['white', 'graphic', 'oversized'],
    sizes: [{size:'XS',stock:10},{size:'S',stock:18},{size:'M',stock:22},{size:'L',stock:14}],
    isFeatured: true, isTrending: true
  },
  {
    name: 'Uncharted Grey Boyfriend T-Shirt',
    brand: 'Bewakoof', category: 't-shirt', gender: 'women', fit: 'oversized',
    price: 499, originalPrice: 799, discountPercent: 38, rating: 4.7, ratingCount: 921,
    pattern: 'graphic', color: 'grey', colors: ['grey'],
    images: ['https://images.bewakoof.com/t640/men-s-grey-uncharted-graphic-printed-t-shirt-685571-1755163388-1.jpg'],
    tags: ['grey', 'oversized', 'casual'],
    sizes: [{size:'XS',stock:7},{size:'S',stock:13},{size:'M',stock:16},{size:'L',stock:8}],
    isFeatured: true
  },
];

const accessoriesProducts = [
  {
    name: 'Marvel Avengers Tote Bag',
    brand: 'Bewakoof', category: 'bag', gender: 'unisex', fit: '',
    price: 399, originalPrice: 599, discountPercent: 33, rating: 4.4, ratingCount: 567,
    collaboration: 'Marvel', pattern: 'graphic', color: 'black', colors: ['black'],
    images: ['https://images.bewakoof.com/t640/men-s-black-leader-typography-t-shirt-296653-1764335348-1.jpg'],
    tags: ['bag', 'tote', 'marvel'], sizes: [{size:'Free Size', stock: 50}], isFeatured: true
  },
  {
    name: 'Naruto Akatsuki Snapback Cap',
    brand: 'Bewakoof', category: 'cap', gender: 'unisex', fit: '',
    price: 499, originalPrice: 749, discountPercent: 33, rating: 4.3, ratingCount: 432,
    collaboration: 'Naruto', pattern: 'graphic', color: 'black', colors: ['black'],
    images: ['https://images.bewakoof.com/t640/men-s-black-hangin-astronaut-graphic-printed-oversized-t-shirt-504166-1741325888-1.jpg'],
    tags: ['cap', 'naruto', 'akatsuki'], sizes: [{size:'Free Size', stock: 40}], isFeatured: true, isTrending: true
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    await Banner.deleteMany({});

    const allProducts = [...menProducts, ...womenProducts, ...accessoriesProducts];
    const createdProducts = await Product.insertMany(allProducts);
    console.log(`✅ Seeded ${createdProducts.length} products with working image URLs`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
