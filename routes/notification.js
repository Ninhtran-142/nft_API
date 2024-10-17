const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET: Fetch notifications for a user
router.get('/:userAddress', async (req, res) => {
    try {
      const notifications = await Notification.find({
        userAddress: req.params.userAddress
      }).sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo (mới nhất trước)
  
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // PATCH: Mark a notification as read
  router.patch('/:id/read', async (req, res) => {
    try {
      const notificationId = req.params.id;
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
  
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const notificationId = req.params.id;
      
      // Tìm và xóa thông báo
      const deletedNotification = await Notification.findByIdAndDelete(notificationId);
  
      if (!deletedNotification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router;