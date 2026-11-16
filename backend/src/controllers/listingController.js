const { Op } = require('sequelize');
const { Listing, User, Review, Booking } = require('../models');

// Helper to calculate average rating
const attachRatingToListing = (listingJson) => {
  if (!listingJson.reviews || listingJson.reviews.length === 0) {
    return {
      ...listingJson,
      ratingCount: 0,
      averageRating: null
    };
  }
  const total = listingJson.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  const avg = Number((total / listingJson.reviews.length).toFixed(2));
  return {
    ...listingJson,
    ratingCount: listingJson.reviews.length,
    averageRating: avg
  };
};

// @desc    Get all listings with filtering, search, and pagination
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res, next) => {
  try {
    const {
      search,
      city,
      category,
      propertyType,
      minPrice,
      maxPrice,
      guests,
      bedrooms,
      hostId,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const where = {};

    // Search query matches title, description, city, or country
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { country: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (city) {
      where.city = { [Op.like]: `%${city}%` };
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight[Op.gte] = Number(minPrice);
      if (maxPrice) where.pricePerNight[Op.lte] = Number(maxPrice);
    }

    if (guests) {
      where.maxGuests = { [Op.gte]: Number(guests) };
    }

    if (bedrooms) {
      where.bedrooms = { [Op.gte]: Number(bedrooms) };
    }

    if (hostId) {
      where.hostId = hostId;
    }

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['pricePerNight', 'ASC']];
    if (sort === 'price_desc') order = [['pricePerNight', 'DESC']];

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Listing.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name', 'avatar', 'createdAt']
        },
        {
          model: Review,
          as: 'reviews',
          attributes: ['rating']
        }
      ],
      order,
      limit: Number(limit),
      offset,
      distinct: true
    });

    const listingsWithRating = rows.map(item => attachRatingToListing(item.toJSON()));

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      data: listingsWithRating
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing by ID with full details & reviews
// @route   GET /api/listings/:id
// @access  Public
exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name', 'email', 'avatar', 'bio', 'createdAt']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'avatar']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const listingJson = listing.toJSON();
    const result = attachRatingToListing(listingJson);

    // Calculate rating breakdowns if reviews exist
    if (listingJson.reviews && listingJson.reviews.length > 0) {
      const len = listingJson.reviews.length;
      result.ratingBreakdown = {
        cleanliness: Number((listingJson.reviews.reduce((a, b) => a + (b.cleanliness || 5), 0) / len).toFixed(1)),
        accuracy: Number((listingJson.reviews.reduce((a, b) => a + (b.accuracy || 5), 0) / len).toFixed(1)),
        communication: Number((listingJson.reviews.reduce((a, b) => a + (b.communication || 5), 0) / len).toFixed(1)),
        location: Number((listingJson.reviews.reduce((a, b) => a + (b.location || 5), 0) / len).toFixed(1)),
        checkIn: Number((listingJson.reviews.reduce((a, b) => a + (b.checkIn || 5), 0) / len).toFixed(1)),
        value: Number((listingJson.reviews.reduce((a, b) => a + (b.value || 5), 0) / len).toFixed(1))
      };
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Host only)
exports.createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      hostId: req.user.id
    };

    // Ensure images and amenities are arrays
    if (typeof listingData.images === 'string') {
      listingData.images = [listingData.images];
    }
    if (typeof listingData.amenities === 'string') {
      listingData.amenities = listingData.amenities.split(',').map(s => s.trim());
    }

    const listing = await Listing.create(listingData);

    // If creator was a guest, upgrade role to host
    if (req.user.role === 'guest') {
      req.user.role = 'host';
      await req.user.save();
    }

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Host owner only)
exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check ownership
    if (listing.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    await listing.update(req.body);

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Host owner only)
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check ownership
    if (listing.hostId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await listing.destroy();

    res.json({
      success: true,
      message: 'Listing removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
