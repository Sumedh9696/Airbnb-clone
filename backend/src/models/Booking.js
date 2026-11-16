const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
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
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  totalNights: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  nightlyPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  cleaningFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  serviceFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  guestCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
    defaultValue: 'confirmed'
  }
}, {
  timestamps: true
});

module.exports = Booking;
