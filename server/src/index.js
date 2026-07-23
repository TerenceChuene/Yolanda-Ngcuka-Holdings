import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { access } from 'fs/promises'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import { ensureBootstrapAdmin } from './controllers/authController.js'
import noticesRouter from './routes/notices.js'
import authRouter from './routes/auth.js'
import { sendStoredFile, migrateDiskUploadsToGridFS } from './storage/files.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const clientDist = process.env.CLIENT_DIST
  ? path.resolve(process.env.CLIENT_DIST)
  : path.resolve(__dirname, '../../dist')

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
)
app.use(express.json())
// Files live in MongoDB GridFS (durable across deploys); disk is fallback only.
app.get('/uploads/:filename', (req, res) => {
  sendStoredFile(req.params.filename, res)
})
app.use('/api/auth', authRouter)
app.use('/api/notices', noticesRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

async function mountClient() {
  try {
    await access(path.join(clientDist, 'index.html'))
  } catch {
    // Local API-only mode — Vite runs separately.
    return
  }

  app.use(express.static(clientDist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next()
    }
    res.sendFile(path.join(clientDist, 'index.html'))
  })

}

function mountErrorHandler() {
  app.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError || err.message?.includes('Invalid file')) {
      return res.status(400).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: 'Internal server error.' })
  })
}

async function start() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  await connectDB(uri)
  await migrateDiskUploadsToGridFS()
  await ensureBootstrapAdmin()
  await mountClient()
  mountErrorHandler()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Client is running on port ${CLIENT_ORIGIN}`)
    console.log('Uploads are served from MongoDB GridFS at /uploads/:filename')
    console.log(`Notices API is running on http://localhost:${PORT}/api/notices`)
    console.log(`Auth API is running on http://localhost:${PORT}/api/auth`)
    console.log(`Health check is running on http://localhost:${PORT}/api/health`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
