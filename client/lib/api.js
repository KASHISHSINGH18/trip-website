const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

export async function apiPost(path, body){
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  return res.json()
}

export async function apiGet(path, token){
  const headers = { 'Content-Type': 'application/json' }
  if(token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(API_BASE + path, { headers })
  return res.json()
}
