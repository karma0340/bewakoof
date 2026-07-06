const express = require('express');
const router = express.Router();
const {
  getProducts, searchProducts, getFeatured,
  getProduct, createProduct, updateProduct, deleteProduct, getSimilar,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const reviewRoutes = require('./reviewRoutes');

router.get('/search', searchProducts);
router.get('/featured', getFeatured);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/similar', getSimilar);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Nested review routes
router.use('/:id/reviews', reviewRoutes);

module.exports = router;
