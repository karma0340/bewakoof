const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAddresses, addAddress, updateAddress, deleteAddress } = require('../controllers/userController');
const { validateCoupon } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.get('/me/addresses', protect, getAddresses);
router.post('/me/addresses', protect, addAddress);
router.put('/me/addresses/:addrId', protect, updateAddress);
router.delete('/me/addresses/:addrId', protect, deleteAddress);

// Coupon validation (also on users since it checks per-user usage)
router.get('/coupons/validate', protect, validateCoupon);

module.exports = router;
