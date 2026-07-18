import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import { ensureBootstrapAdmin } from './controllers/authController.js'
import noticesRouter from './routes/notices.js'
import authRouter from './routes/auth.js'
import { uploadsDir } from './middleware/upload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
)
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))
app.use('/api/auth', authRouter)
app.use('/api/notices', noticesRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message?.includes('Invalid file')) {
    return res.status(400).json({ error: err.message })
  }
  console.error(err)
  return res.status(500).json({ error: 'Internal server error.' })
})

async function start() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  await connectDB(uri)
  await ensureBootstrapAdmin()

  app.listen(PORT, () => {
    console.log(`Notice API listening on http://localhost:${PORT}`)
    console.log(`Uploads served from ${path.resolve(__dirname, '../uploads')}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
