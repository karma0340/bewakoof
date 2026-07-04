const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
