import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'

export default function Profile(){
  const [user,setUser]=useState(null)

  useEffect(()=>{
    const token = localStorage.getItem('trip_token')
    if(!token) return
    apiGet('/api/auth/me', token).then(r=>{
      if(r && r.email) setUser(r)
    })
  },[])

  if(!user) return <main className="container"><p>Please log in to view your profile.</p></main>

  return (
    <main className="container">
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </main>
  )
}
