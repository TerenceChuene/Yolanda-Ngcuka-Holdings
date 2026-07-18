import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Admin } from '../models/Admin.js'

const TOKEN_TTL = '12h'

function signToken(admin) {
  return jwt.sign(
    { email: admin.email },
    process.env.JWT_SECRET,
    { subject: String(admin._id), expiresIn: TOKEN_TTL },
  )
}

/** Ensure a bootstrap admin exists from env credentials */
export async function ensureBootstrapAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || ''

  if (!email || !password) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin bootstrap')
    return
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required for admin authentication')
  }

  const existing = await Admin.findOne({ email })
  if (existing) return

  const passwordHash = await bcrypt.hash(password, 12)
  await Admin.create({
    email,
    passwordHash,
    name: process.env.ADMIN_NAME || 'Site Admin',
  })
  console.log(`Bootstrap admin created: ${email}`)
}

export async function login(req, res) {
  try {
    const email = (req.body.email || '').trim().toLowerCase()
    const password = req.body.password || ''

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = signToken(admin)
    return res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (err) {
    console.error('login error:', err)
    return res.status(500).json({ error: 'Login failed.' })
  }
}

export async function me(req, res) {
  try {
    const admin = await Admin.findById(req.admin.id)
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found.' })
    }
    return res.json({
      id: admin._id,
      email: admin.email,
      name: admin.name,
    })
  } catch (err) {
    console.error('me error:', err)
    return res.status(500).json({ error: 'Failed to load profile.' })
  }
}
