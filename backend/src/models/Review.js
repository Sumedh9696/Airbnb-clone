const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  listingId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  cleanliness: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 1, max: 5 }
  },
  accuracy: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 1, max: 5 }
  },
  communication: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 1, max: 5 }
  },
  location: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 1, max: 5 }
  },
  checkIn: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 1, max: 5 }
  },
  value: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Review comment cannot be empty' }
    }
  }
}, {
  timestamps: true
});

module.exports = Review;
