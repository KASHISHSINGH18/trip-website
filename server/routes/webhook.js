const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const stripeSecret = process.env.STRIPE_SECRET || ''
const stripe = stripeSecret ? require('stripe')(stripeSecret) : null

router.post('/', async (req, res) => {
  // This route expects raw body; index.js should mount it with raw parser
  let event = null
  try{
    if(stripe && process.env.STRIPE_WEBHOOK_SECRET){
      const sig = req.headers['stripe-signature']
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } else {
      // no signature verification (dev): parse JSON body
      event = JSON.parse(req.body.toString())
    }
  }catch(err){
    console.error('Webhook signature verification failed or body parse failed', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the checkout.session.completed event
  if(event.type === 'checkout.session.completed'){
    const session = event.data.object
    const bookingId = session.metadata && session.metadata.bookingId
    try{
      if(bookingId){
        await Booking.findByIdAndUpdate(bookingId, { paid: true })
        console.log('Marked booking paid:', bookingId)
      }
    }catch(err){
      console.error('Failed to mark booking paid', err)
    }
  }

  res.json({ received: true })
})

module.exports = router
