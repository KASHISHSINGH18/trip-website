const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()
const authMiddleware = require('../middleware/auth')

router.post('/register', async (req, res)=>{
  const { name, email, password } = req.body
  if(!email || !password) return res.status(400).json({error:'email+password required'})
  try{
    const existing = await User.findOne({ email })
    if(existing) return res.status(400).json({ error: 'User exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash: hash })
    res.json({ id: user._id, email: user.email, name: user.name })
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req,res)=>{
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if(!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if(!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
  res.json({ token })
})

// Get current user from token
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
    if(!user) return res.status(404).json({ error: 'User not found' })
    res.json({ id: user._id, email: user.email, name: user.name })
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
