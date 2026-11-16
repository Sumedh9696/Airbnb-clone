const { Review, Booking, Listing, User } = require('../models');

// @desc    Add review for a listing
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const {
      listingId,
      rating,
      comment,
      cleanliness,
      accuracy,
      communication,
      location,
      checkIn,
      value
    } = req.body;

    if (!listingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide listingId, rating, and comment'
      });
    }

    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Host cannot review their own listing
    if (listing.hostId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review your own listing'
      });
    }

    // Check if user already reviewed this listing
    const existingReview = await Review.findOne({
      where: {
        listingId,
        userId: req.user.id
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this listing'
      });
    }

    const review = await Review.create({
      listingId,
      userId: req.user.id,
      rating: Number(rating),
      comment,
      cleanliness: cleanliness ? Number(cleanliness) : 5,
      accuracy: accuracy ? Number(accuracy) : 5,
      communication: communication ? Number(communication) : 5,
      location: location ? Number(location) : 5,
      checkIn: checkIn ? Number(checkIn) : 5,
      value: value ? Number(value) : 5
    });

    const fullReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: fullReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a listing
// @route   GET /api/reviews/listing/:listingId
// @access  Public
exports.getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { listingId: req.params.listingId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(2)) : null;

    res.json({
      success: true,
      count: reviews.length,
      averageRating,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Author or Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
