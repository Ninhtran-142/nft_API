const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userAddress: { type: String, required: true }, // Địa chỉ người dùng để gửi thông báo
  message: { type: String, required: true },      // Nội dung thông báo
  type: { type: String, required: true }, // Loại thông báo
  isRead: { type: Boolean, default: false },      // Trạng thái đã đọc
  createdAt: { type: Date, default: Date.now },   // Ngày tạo thông báo
});

module.exports = mongoose.model('Notification', notificationSchema);
