const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    ownerAddress: String,
    colletionAddress: String,
    name: String,
    symbol: String,
    imgurl: String
  });
  
  module.exports = mongoose.model('Collection', collectionSchema);