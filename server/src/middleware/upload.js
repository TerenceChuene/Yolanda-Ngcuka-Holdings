import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const uploadsDir = path.join(__dirname, '../../uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'])
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
])

function getExtension(filename) {
  return path.extname(filename).slice(1).toLowerCase()
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadsDir)
  },
  filename(_req, file, cb) {
    const ext = getExtension(file.originalname)
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}.${ext}`)
  },
})

function fileFilter(_req, file, cb) {
  const ext = getExtension(file.originalname)
  if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG.'))
    return
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})

export { getExtension, ALLOWED_EXTENSIONS }
