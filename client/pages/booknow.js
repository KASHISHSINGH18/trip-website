import { useState } from 'react'
import { apiPost } from '../lib/api'
import { useRouter } from 'next/router'

export default function BookNow() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [trip, setTrip] = useState('Amazing Trip')
  const [price, setPrice] = useState(199)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault()
    const token = typeof window !== 'undefined' ? localStorage.getItem('trip_token') : null
    if(!token){
      alert('Please log in to book a trip')
      router.push('/login')
      return
    }
    setLoading(true)
    try{
      // create booking record
      const booking = await apiPost('/api/bookings', { name, email, trip, price })
      // start Stripe Checkout session
      const sessionRes = await apiPost('/api/bookings/checkout-session', { name, email, trip, price })
      if(sessionRes && sessionRes.url){
        // redirect to Stripe hosted checkout
        window.location.href = sessionRes.url
      } else {
        alert(sessionRes.error || 'Failed to start checkout')
      }
    }catch(err){
      console.error(err)
      alert('Booking failed')
    }finally{ setLoading(false) }
  }

  return (
    <main className="container">
      <h2>Book a Trip</h2>
      <form onSubmit={submit} className="form">
        <label>Name <input value={name} onChange={e=>setName(e.target.value)} required /></label>
        <label>Email <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Trip <input value={trip} onChange={e=>setTrip(e.target.value)} /></label>
        <label>Price <input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} /></label>
        <button type="submit" disabled={loading}>{loading ? 'Processing…' : 'Proceed to Payment'}</button>
      </form>
    </main>
  )
}
