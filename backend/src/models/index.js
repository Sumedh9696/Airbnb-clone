const { sequelize } = require('../config/db');
const User = require('./User');
const Listing = require('./Listing');
const Booking = require('./Booking');
const Review = require('./Review');

// Associations

// Host <-> Listings
User.hasMany(Listing, { foreignKey: 'hostId', as: 'hostedListings', onDelete: 'CASCADE' });
Listing.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

// Guest <-> Bookings
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'guest' });

// Listing <-> Bookings
Listing.hasMany(Booking, { foreignKey: 'listingId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

// User <-> Reviews
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Listing <-> Reviews
Listing.hasMany(Review, { foreignKey: 'listingId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

module.exports = {
  sequelize,
  User,
  Listing,
  Booking,
  Review
};
