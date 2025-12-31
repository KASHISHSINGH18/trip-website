import { useState } from 'react'
import { apiPost } from '../lib/api'
import { useRouter } from 'next/router'

export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const router = useRouter()

  const submit = async (e) =>{
    e.preventDefault()
    const res = await apiPost('/api/auth/register', { name, email, password })
    if(res && res.id){
      alert('Registered — you can now log in')
      router.push('/login')
    } else {
      alert(res.error || 'Registration failed')
    }
  }

  return (
    <main className="container">
      <h2>Register</h2>
      <form onSubmit={submit} className="form">
        <label>Name <input value={name} onChange={e=>setName(e.target.value)} required /></label>
        <label>Email <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Password <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button type="submit">Register</button>
      </form>
    </main>
  )
}
