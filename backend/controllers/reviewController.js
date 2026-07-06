const Review = require('../models/Review');
const Product = require('../models/Product');

// @GET /api/products/:id/reviews
const getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const filter = { product: req.params.id };
    if (rating) filter.rating = Number(rating);
    
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Rating breakdown
    const allReviews = await Review.find({ product: req.params.id }).select('rating');
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(r => { breakdown[r.rating] = (breakdown[r.rating] || 0) + 1; });
    
    res.json({ reviews, total, page: Number(page), pages: Math.ceil(total / Number(limit)), breakdown });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/products/:id/reviews
const addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment required' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if already reviewed
    const existing = await Review.findOne({ product: req.params.id, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = await Review.create({
      product: req.params.id,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment,
      verified: true,
    });

    // Update product rating
    const reviews = await Review.find({ product: req.params.id }).select('rating');
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.params.id, {
      rating: parseFloat(avgRating.toFixed(1)),
      ratingCount: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/products/:id/reviews/:reviewId
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };
