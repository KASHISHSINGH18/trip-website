require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const bookingRoutes = require('./routes/bookings')
const contactRoutes = require('./routes/contact')

const path = require('path');

const app = express()
app.use(cors())

// Use JSON parser for most routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', require('./routes/admin'))

// Serve Index.html on Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

const PORT = process.env.PORT || 5000; // Use environment port for Render

app.listen(PORT, () => {
  console.log('Server listening on port', PORT)
  console.log('Using local JSON database')
})
