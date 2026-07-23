import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
/** Local disk fallback (dev / legacy uploads only). Production uses GridFS. */
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

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp'])
const IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
])

function getExtension(filename) {
  return path.extname(filename).slice(1).toLowerCase()
}

/** Memory storage — files are persisted to MongoDB GridFS after upload. */
const storage = multer.memoryStorage()

function fileFilter(_req, file, cb) {
  const ext = getExtension(file.originalname)
  if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG.'))
    return
  }
  cb(null, true)
}

function imageFileFilter(_req, file, cb) {
  const ext = getExtension(file.originalname)
  if (!IMAGE_EXTENSIONS.has(ext) || !IMAGE_MIME_TYPES.has(file.mimetype)) {
    cb(new Error('Invalid image type. Allowed: PNG, JPG, JPEG, WEBP.'))
    return
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})

/** Project portfolio images */
export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})


export function buildStoredFilename(originalname) {
  const ext = getExtension(originalname)
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  return `${unique}.${ext}`
}

export { getExtension, ALLOWED_EXTENSIONS }
