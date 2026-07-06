/**
 * Full Seeder - parses local HTML + scrapes live pages + seeds MongoDB
 */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const { scrapeFromLiveAndLocal } = require('../scripts/scraper');
const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const connectDB = require('../config/db');


const seedCoupons = async () => {
  await Coupon.deleteMany({});
  await Coupon.insertMany([
    { code: 'WELCOME10', discountType: 'percent', value: 10, minOrder: 499, maxUses: 1000, description: '10% off on first order' },
    { code: 'FLAT100', discountType: 'flat', value: 100, minOrder: 799, maxUses: 500, description: '₹100 off on orders above ₹799' },
    { code: 'BEWAKOOF20', discountType: 'percent', value: 20, minOrder: 999, maxUses: 200, description: '20% off on orders above ₹999' },
    { code: 'SALE15', discountType: 'percent', value: 15, minOrder: 599, maxUses: 1000, description: '15% off sitewide' },
    { code: 'NEWUSER50', discountType: 'flat', value: 50, minOrder: 399, maxUses: 500, description: '₹50 off for new users' },
  ]);
  console.log('✅ Coupons seeded');
};

const main = async () => {
  try {
    await connectDB();

    // Scrape products
    console.log('\n🕷️  Starting product scraper...');
    const products = await scrapeFromLiveAndLocal();

    if (products.length === 0) {
      console.log('❌ No products scraped. Aborting.');
      process.exit(1);
    }

    // Clear and reseed products
    console.log(`\n🗑️  Clearing existing products...`);
    await Product.deleteMany({});

    console.log(`📦 Inserting ${products.length} products...`);
    const docs = products.map(p => ({
      name: p.name,
      brand: p.brand || 'Bewakoof',
      description: p.description || '',
      category: p.category,
      gender: p.gender,
      subCategory: p.subCategory || '',
      fit: p.fit || 'regular',
      images: p.images || [],
      sizes: p.sizes || [],
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercent: p.discountPercent || 0,
      color: p.color || '',
      colors: p.colors || [],
      pattern: p.pattern || '',
      rating: parseFloat((p.rating || 4.0).toFixed(1)),
      ratingCount: p.ratingCount || 0,
      collaboration: p.collaboration || '',
      tags: p.tags ? p.tags.map(t => typeof t === 'object' ? t.label : String(t)) : [],
      isActive: true,
      isFeatured: p.isFeatured || false,
      isTrending: p.isTrending || false,
    }));

    const mockItems = [
      {
        name: "Men's Black Solid Cotton Polo T-Shirt",
        brand: "Bewakoof",
        description: "Classic black polo t-shirt with a refined collar and premium cotton blend. Perfect for smart casual occasions.",
        category: "polo",
        gender: "men",
        fit: "regular",
        price: 549,
        originalPrice: 1099,
        discountPercent: 50,
        color: "Black",
        colors: ["Black", "White", "Navy"],
        pattern: "solid",
        rating: 4.6,
        ratingCount: 154,
        images: ["https://images.bewakoof.com/t1080/men-s-black-solid-polo-t-shirt-105-1702462100-1.jpg"],
        sizes: [{ size: "M", stock: 15 }, { size: "L", stock: 20 }, { size: "XL", stock: 10 }]
      },
      {
        name: "Men's Navy Blue Striped Polo T-Shirt",
        brand: "Bewakoof",
        description: "Look sharp and stay comfortable in this navy blue striped polo shirt.",
        category: "polo",
        gender: "men",
        fit: "regular",
        price: 599,
        originalPrice: 1299,
        discountPercent: 54,
        color: "Navy Blue",
        colors: ["Navy Blue", "Grey"],
        pattern: "striped",
        rating: 4.5,
        ratingCount: 89,
        images: ["https://images.bewakoof.com/t1080/men-s-navy-striped-polo-t-shirt-302-1702462100-1.jpg"],
        sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 15 }, { size: "L", stock: 20 }]
      },
      {
        name: "Women's Maroon Solid Polo Shirt",
        brand: "Bewakoof",
        description: "Maroon premium pique cotton polo shirt for women, offering a clean smart-casual look.",
        category: "polo",
        gender: "women",
        fit: "regular",
        price: 499,
        originalPrice: 999,
        discountPercent: 50,
        color: "Maroon",
        colors: ["Maroon", "White"],
        pattern: "solid",
        rating: 4.4,
        ratingCount: 62,
        images: ["https://images.bewakoof.com/t1080/women-s-maroon-solid-polo-t-shirt-205-1702462100-1.jpg"],
        sizes: [{ size: "S", stock: 12 }, { size: "M", stock: 18 }, { size: "L", stock: 15 }]
      },
      {
        name: "Men's Yellow Graphic Printed Hoodie",
        brand: "Bewakoof",
        description: "Keep it warm and stylish with this custom printed yellow hoodie.",
        category: "hoodie",
        gender: "men",
        fit: "oversized",
        price: 899,
        originalPrice: 1999,
        discountPercent: 55,
        color: "Yellow",
        colors: ["Yellow", "Black"],
        pattern: "graphic",
        rating: 4.8,
        ratingCount: 312,
        images: ["https://images.bewakoof.com/t1080/men-s-yellow-printed-hoodie-502-1702462100-1.jpg"],
        sizes: [{ size: "M", stock: 25 }, { size: "L", stock: 30 }, { size: "XL", stock: 20 }]
      },
      {
        name: "Men's Olive Green Solid Sweatshirt",
        brand: "Bewakoof",
        description: "Your go-to comfort companion. An olive green sweatshirt made of ultra-soft fleece.",
        category: "sweatshirt",
        gender: "men",
        fit: "regular",
        price: 799,
        originalPrice: 1799,
        discountPercent: 56,
        color: "Olive Green",
        colors: ["Olive Green", "Charcoal"],
        pattern: "solid",
        rating: 4.7,
        ratingCount: 195,
        images: ["https://images.bewakoof.com/t1080/men-s-olive-sweatshirt-402-1702462100-1.jpg"],
        sizes: [{ size: "M", stock: 12 }, { size: "L", stock: 18 }, { size: "XL", stock: 15 }]
      },
      {
        name: "Women's Lilac Oversized Printed Sweatshirt",
        brand: "Bewakoof",
        description: "A gorgeous pastel lilac sweatshirt featuring a cute graphic print on the front.",
        category: "sweatshirt",
        gender: "women",
        fit: "oversized",
        price: 849,
        originalPrice: 1899,
        discountPercent: 55,
        color: "Lilac",
        colors: ["Lilac"],
        pattern: "graphic",
        rating: 4.7,
        ratingCount: 143,
        images: ["https://images.bewakoof.com/t1080/women-s-lilac-printed-sweatshirt-309-1702462100-1.jpg"],
        sizes: [{ size: "S", stock: 10 }, { size: "M", stock: 20 }, { size: "L", stock: 15 }]
      },
      {
        name: "Women's Grey Casual Fleece Hoodie",
        brand: "Bewakoof",
        description: "A cozy, lightweight grey fleece hoodie for everyday loungewear.",
        category: "hoodie",
        gender: "women",
        fit: "regular",
        price: 899,
        originalPrice: 1999,
        discountPercent: 55,
        color: "Grey",
        colors: ["Grey", "Black"],
        pattern: "solid",
        rating: 4.6,
        ratingCount: 99,
        images: ["https://images.bewakoof.com/t1080/women-s-grey-fleece-hoodie-602-1702462100-1.jpg"],
        sizes: [{ size: "S", stock: 15 }, { size: "M", stock: 22 }, { size: "L", stock: 14 }]
      }
    ];

    const finalDocs = [...docs, ...mockItems];
    await Product.insertMany(finalDocs, { ordered: false });
    console.log(`✅ ${finalDocs.length} products seeded (${docs.length} scraped + ${mockItems.length} injected)!`);

    await seedCoupons();

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
};

main();
