const express = require('express');
const router = express.Router();
const usersDb = require('../models/User'); // Actually uses JsonDb instance
const bookingsDb = require('../models/Booking'); // Actually uses JsonDb instance
const JsonDb = require('../utils/jsonDb');
const contactsDb = new JsonDb('contacts');

router.get('/data', async (req, res) => {
    try {
        const bookings = await bookingsDb.find({});
        const contacts = await contactsDb.find({});
        // In a real app we would not send all users/passwords!
        const users = await usersDb.find({});

        res.json({
            bookings,
            contacts,
            usersCount: users.length
        });
    } catch (error) {
        console.error('Admin Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch admin data' });
    }
});

module.exports = router;
