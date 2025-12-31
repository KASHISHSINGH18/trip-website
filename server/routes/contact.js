const express = require('express');
const router = express.Router();
const JsonDb = require('../utils/jsonDb');
const contactsDb = new JsonDb('contacts');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newContact = await contactsDb.create({ name, email, message });
        res.status(201).json({ message: 'Contact submitted successfully', data: newContact });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
