import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'

export default function Bookings(){
  const [bookings,setBookings]=useState([])

  useEffect(()=>{
    const token = localStorage.getItem('trip_token')
    if(!token) return
    apiGet('/api/bookings/mine', token).then(r=>{
      if(Array.isArray(r)) setBookings(r)
    })
  },[])

  return (
    <main className="container">
      <h2>Your Bookings</h2>
      {bookings.length===0 && <p>No bookings yet.</p>}
      <ul>
        {bookings.map(b=> (
          <li key={b._id}>{b.trip} — ${b.price} — {b.paid? 'Paid':'Pending'}</li>
        ))}
      </ul>
    </main>
  )
}
