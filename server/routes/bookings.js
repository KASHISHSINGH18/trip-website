const express = require('express')
const stripeSecret = process.env.STRIPE_SECRET || ''
const stripe = stripeSecret ? require('stripe')(stripeSecret) : null
const Booking = require('../models/Booking')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// create a booking (if user is logged in, associate with user)
router.post('/', async (req, res) => {
  const { name, email, trip, price } = req.body
  let userId = null
  try{
    // if authorization header provided, try to decode token
    const auth = req.headers.authorization
    if(auth && auth.startsWith('Bearer ')){
      try{
        const jwt = require('jsonwebtoken')
        const payload = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'devsecret')
        userId = payload.id
      }catch(e){
        // ignore token errors for optional association
      }
    }

    const booking = await Booking.create({ userId, name, email, trip, price })
    res.json(booking)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// Get bookings for current user
router.get('/mine', authMiddleware, async (req,res)=>{
  try{
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(bookings)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// Get booking by id (public, for testing)
router.get('/:id', async (req,res)=>{
  try{
    const booking = await Booking.findById(req.params.id)
    if(!booking) return res.status(404).json({ error: 'Not found' })
    res.json(booking)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create a Stripe Checkout Session and return URL (requires STRIPE_SECRET)
router.post('/checkout-session', async (req,res)=>{
  if(!stripe) return res.status(500).json({ error: 'Stripe not configured (set STRIPE_SECRET)' })
  const { name, email, trip, price } = req.body
  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: trip || 'Trip Booking' },
          unit_amount: Math.round((price || 0) * 100)
        },
        quantity: 1
      }],
      customer_email: email,
      success_url: (process.env.CLIENT_URL || 'http://localhost:3000') + '/bookings?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: (process.env.CLIENT_URL || 'http://localhost:3000') + '/booknow'
    })

    // Optionally create booking record marked unpaid; webhook should mark paid
  const booking = await Booking.create({ name, email, trip, price, paid: false })

  // attach booking id so webhook can mark it paid
  await stripe.checkout.sessions.update(session.id, { metadata: { bookingId: String(booking._id) } })

  res.json({ url: session.url, bookingId: booking._id })
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Stripe error' })
  }
})

module.exports = router
