const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description is required' }
    }
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Trending',
    allowNull: false
  },
  propertyType: {
    type: DataTypes.STRING,
    defaultValue: 'Apartment'
  },
  roomType: {
    type: DataTypes.STRING,
    defaultValue: 'Entire place'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  pricePerNight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Price per night must be at least 1' }
    }
  },
  cleaningFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    validate: {
      min: 1
    }
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  beds: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  bathrooms: {
    type: DataTypes.FLOAT,
    defaultValue: 1
  },
  amenities: {
    type: DataTypes.JSON, // Stores array of strings
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON, // Stores array of image URLs
    defaultValue: []
  },
  hostId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Listing;
