const express = require('express');
const router = express.Router();
const CouponRequest = require('../models/CouponRequest');
const Notification = require('../models/Notification');

// POST: Create a new coupon request
router.post('/', async (req, res) => {
  try {
    const { userAddress } = req.body;
    const newRequest = new CouponRequest({
      userAddress,
      requestTime: new Date(),
      status: 'pending'
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//GET: Get Request by ID
router.get('/requests/:id', async (req, res) => {
  try {
    const request = await CouponRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Coupon request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all pending coupon requests
router.get('/pending', async (req, res) => {
  try {
    const pendingRequests = await CouponRequest.find({ status: 'pending' });
    res.json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error); // Thêm dòng này
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch latest coupon for a user
router.get('/latest/:userAddress', async (req, res) => {
  try {
    const latestCoupon = await CouponRequest.findOne({ 
      userAddress: req.params.userAddress 
    }).sort({ requestTime: -1 });
    res.json(latestCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update a coupon request (for generating coupon)
router.put('/generate/:id', async (req, res) => {
  try {
    const { expireTimestamp, signature } = req.body;
    const updatedRequest = await CouponRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'generated', expireTimestamp, signature },
      { new: true }
    );
   // Nếu coupon được tạo thành công, tạo thông báo cho người dùng
   if (updatedRequest) {
    const notification = new Notification({
      userAddress: updatedRequest.userAddress,
      message: `Your coupon with ID ${updatedRequest._id} has been successfully generated.`,
      type: 'generated'
    });
    await notification.save();
  } 

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH: Reject a coupon request by ID
router.patch('/reject/:id', async (req, res) => {
  try {
    const requestId = req.params.id;

    const updatedRequest = await CouponRequest.findByIdAndUpdate(
      requestId,
      { status: 'rejected', rejectedAt: new Date() }, // Cập nhật trường rejectedAt
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Coupon request not found' });
    }

    // Tạo thông báo khi yêu cầu bị từ chối
    const notification = new Notification({
      userAddress: updatedRequest.userAddress,
      message: `Your coupon request with ID ${updatedRequest._id} has been rejected.`,
      type: 'rejected'
    });
    await notification.save();

    res.json({ message: 'Coupon request rejected successfully', request: updatedRequest });
  } catch (error) {
    console.error('Error rejecting coupon request:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Delete a coupon request by ID
router.delete('/:id', async (req, res) => {
  try {
    const requestId = req.params.id;

    // Tìm và xóa yêu cầu
    const deletedRequest = await CouponRequest.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Coupon request not found' });
    }

    res.json({ message: 'Coupon request deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon request:', error);
    res.status(500).json({ message: error.message });
  }
});

const updateOldRejectedRequests = async () => {
  const now = new Date();
  await CouponRequest.updateMany(
    { status: 'rejected', rejectedAt: { $exists: false } },  // Chỉ những tài liệu có status 'rejected' mà chưa có 'rejectedAt'
    { $set: { rejectedAt: now } }  // Đặt rejectedAt cho tài liệu cũ
  );
  console.log("Updated old rejected requests with rejectedAt field.");
};
updateOldRejectedRequests();



module.exports = router;