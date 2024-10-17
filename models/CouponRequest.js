const mongoose = require('mongoose');

const couponRequestSchema = new mongoose.Schema({
  userAddress: String,
  requestTime: Date,
  status: String,
  expireTimestamp: Number,
  signature: String,
  rejectedAt: { type: Date, expires: '5d' } // Tự động xóa sau 5 ngày
});

module.exports = mongoose.model('CouponRequest', couponRequestSchema);