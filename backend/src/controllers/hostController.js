const { Listing, Booking, Review, User } = require('../models');

// @desc    Get Host Dashboard Statistics and Overview
// @route   GET /api/host/dashboard
// @access  Private (Host only)
exports.getHostDashboard = async (req, res, next) => {
  try {
    const hostId = req.user.id;

    // Get all listings created by this host
    const listings = await Listing.findAll({
      where: { hostId },
      include: [
        {
          model: Booking,
          as: 'bookings',
          attributes: ['id', 'startDate', 'endDate', 'totalPrice', 'status']
        },
        {
          model: Review,
          as: 'reviews',
          attributes: ['rating']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const listingIds = listings.map(l => l.id);

    // Get all reservations for host listings
    const reservations = await Booking.findAll({
      where: {
        listingId: listingIds
      },
      include: [
        {
          model: User,
          as: 'guest',
          attributes: ['id', 'name', 'avatar', 'email']
        },
        {
          model: Listing,
          as: 'listing',
          attributes: ['id', 'title', 'city', 'country', 'pricePerNight', 'images']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Compute metrics
    const totalListings = listings.length;
    const totalReservations = reservations.filter(r => r.status !== 'cancelled').length;
    const totalRevenue = reservations
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + (r.nightlyPrice * r.totalNights), 0);

    // Compute overall average rating across host listings
    let totalReviews = 0;
    let sumRating = 0;
    listings.forEach(listing => {
      if (listing.reviews) {
        totalReviews += listing.reviews.length;
        sumRating += listing.reviews.reduce((acc, rev) => acc + rev.rating, 0);
      }
    });
    const averageHostRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(2)) : 5.0;

    res.json({
      success: true,
      data: {
        stats: {
          totalListings,
          totalReservations,
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalReviews,
          averageHostRating
        },
        listings,
        recentReservations: reservations.slice(0, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};
