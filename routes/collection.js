const express = require('express');
const Collection = require('../models/Collection');
const router = express.Router();

// GET all collections
router.get('/', async (req, res) => {
    try {
      const collections = await Collection.find();
      res.json(collections);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // GET collections by owner
  router.get('/owner/:ownerAddress', async (req, res) => {
    try {
      const collections = await Collection.find({ ownerAddress: req.params.ownerAddress });
      if (collections.length === 0) {
        return res.status(404).json({ message: 'No collections found for this owner' });
      }
      res.json(collections);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/contract/:colletionAddress', async (req, res) => {
    try {
        // Sử dụng $regex để tìm kiếm không phân biệt chữ hoa chữ thường
        const collections = await Collection.find({
            colletionAddress: { $regex: new RegExp(`^${req.params.colletionAddress}$`, 'i') }
        });

        if (collections.length === 0) {
            return res.status(404).json({ message: 'No collections found for this owner' });
        }
        
        res.json(collections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
  // POST a new collection
  router.post('/', async (req, res) => {
    const collection = new Collection({
      ownerAddress: req.body.ownerAddress,
      colletionAddress: req.body.colletionAddress,
      name: req.body.name,
      symbol: req.body.symbol,
      imgurl: req.body.imgurl
    });
  
    try {
      const newCollection = await collection.save();
      res.status(201).json(newCollection);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const collectionId = req.params.id;
      
      // Tìm và xóa thông báo
      const deletedCollection = await Collection.findByIdAndDelete(collectionId);
  
      if (!deletedCollection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
  
      res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;
