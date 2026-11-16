const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getListingBookings,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/listing/:listingId', getListingBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
