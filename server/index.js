const express = require('express')
const cors = require('cors')
const path = require('path');
require('dotenv').config();

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/bookings', require('./routes/bookings'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/admin', require('./routes/admin'))

// Serve Index.html on Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
  console.log('Using local JSON database')
})
