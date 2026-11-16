const { Op } = require('sequelize');
const { Booking, Listing, User, sequelize } = require('../models');

// Helper to calculate nights between two dates
const calculateNights = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// @desc    Create new booking with transactional overlap validation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { listingId, startDate, endDate, guestCount = 1 } = req.body;

    if (!listingId || !startDate || !endDate) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide listingId, startDate, and endDate'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (end <= start) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const listing = await Listing.findByPk(listingId, { transaction: t });
    if (!listing) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Host cannot book their own property
    if (listing.hostId === req.user.id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own listing'
      });
    }

    // Validate max guests
    if (guestCount > listing.maxGuests) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `This listing accommodates a maximum of ${listing.maxGuests} guests`
      });
    }

    // OVERLAP VALIDATION QUERY:
    // Existing booking overlaps if:
    // existing.startDate < requested.endDate AND existing.endDate > requested.startDate
    const conflictingBooking = await Booking.findOne({
      where: {
        listingId,
        status: { [Op.ne]: 'cancelled' },
        startDate: { [Op.lt]: endDate },
        endDate: { [Op.gt]: startDate }
      },
      transaction: t
    });

    if (conflictingBooking) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'The selected dates are no longer available. Please choose different dates.'
      });
    }

    const nights = calculateNights(startDate, endDate);
    const nightlyPrice = listing.pricePerNight;
    const accommodationTotal = nightlyPrice * nights;
    const cleaningFee = listing.cleaningFee || 0;
    const serviceFee = Number((accommodationTotal * 0.12).toFixed(2)); // 12% service fee
    const totalPrice = Number((accommodationTotal + cleaningFee + serviceFee).toFixed(2));

    const booking = await Booking.create({
      listingId,
      userId: req.user.id,
      startDate,
      endDate,
      totalNights: nights,
      nightlyPrice,
      cleaningFee,
      serviceFee,
      totalPrice,
      guestCount,
      status: 'confirmed'
    }, { transaction: t });

    await t.commit();

    // Fetch full booking details for response
    const fullBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Listing,
          as: 'listing',
          include: [{ model: User, as: 'host', attributes: ['id', 'name', 'avatar'] }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: fullBooking
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Listing,
          as: 'listing',
          include: [{ model: User, as: 'host', attributes: ['id', 'name', 'avatar', 'email'] }]
        }
      ],
      order: [['startDate', 'DESC']]
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booked date ranges for a listing (to disable in date-picker)
// @route   GET /api/bookings/listing/:listingId
// @access  Public
exports.getListingBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        listingId: req.params.listingId,
        status: { [Op.ne]: 'cancelled' },
        endDate: { [Op.gte]: new Date().toISOString().split('T')[0] }
      },
      attributes: ['id', 'startDate', 'endDate']
    });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Listing, as: 'listing' }]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Guest who booked OR host of the listing can cancel
    const isGuest = booking.userId === req.user.id;
    const isHost = booking.listing.hostId === req.user.id;

    if (!isGuest && !isHost && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
