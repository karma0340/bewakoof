const Product = require('../models/Product');

// @GET /api/products
const getProducts = async (req, res) => {
  try {
    const {
      gender, category, size, color, pattern, fit, collaboration,
      minPrice, maxPrice, discount, rating, sort, page = 1, limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (gender) filter.gender = { $in: gender.split(',') };
    if (category) filter.category = { $in: category.split(',') };
    if (color) filter.colors = { $in: color.split(',').map((c) => new RegExp(c, 'i')) };
    if (pattern) filter.pattern = { $in: pattern.split(',') };
    if (fit) filter.fit = { $in: fit.split(',') };
    if (collaboration) filter.collaboration = { $in: collaboration.split(',').map((c) => new RegExp(c, 'i')) };
    if (size) filter['sizes.size'] = { $in: size.split(',') };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (discount) filter.discountPercent = { $gte: Number(discount) };
    if (rating) filter.rating = { $gte: Number(rating) };

    const sortOptions = {
      popularity: { rating: -1, ratingCount: -1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      newest: { createdAt: -1 },
      discount: { discountPercent: -1 },
    };
    const sortBy = sortOptions[sort] || sortOptions.popularity;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortBy).skip(skip).limit(Number(limit));

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/products/search?q=
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) return res.json({ products: [], total: 0 });

    const skip = (Number(page) - 1) * Number(limit);
    const filter = { $text: { $search: q }, isActive: true };
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/products/featured
const getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(12);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, searchProducts, getFeatured, getProduct, createProduct, updateProduct, deleteProduct };
