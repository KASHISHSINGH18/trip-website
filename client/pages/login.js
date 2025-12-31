import { useState } from 'react'
import { apiPost } from '../lib/api'
import { useRouter } from 'next/router'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const router = useRouter()

  const submit = async (e) =>{
    e.preventDefault()
    const res = await apiPost('/api/auth/login', { email, password })
    if(res && res.token){
      localStorage.setItem('trip_token', res.token)
      alert('Logged in')
      router.push('/profile')
    } else {
      alert(res.error || 'Login failed')
    }
  }

  return (
    <main className="container">
      <h2>Login</h2>
      <form onSubmit={submit} className="form">
        <label>Email <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Password <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
