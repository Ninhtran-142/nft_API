const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define routes
const couponRequestsRouter = require('./routes/couponRequests');
app.use('/api/couponRequests', couponRequestsRouter);

const notificationRouter = require('./routes/notification'); 
app.use('/api/notifications', notificationRouter); 

const collectionRoutes = require('./routes/collection');
app.use('/api/collections', collectionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
