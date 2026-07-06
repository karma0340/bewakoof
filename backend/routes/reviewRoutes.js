const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams for :id from product routes
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', getReviews);
router.post('/', protect, addReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
