import fs from 'fs'
import path from 'path'
import { Notice } from '../models/Notice.js'
import { getExtension, uploadsDir } from '../middleware/upload.js'

const VALID_DURATIONS = new Set([30, 60])

function calculateExpiresAt(days) {
  const expires = new Date()
  expires.setDate(expires.getDate() + days)
  return expires
}

function removeUploadedFile(filePath) {
  if (!filePath) return
  fs.promises.unlink(filePath).catch(() => {
    // File may already be gone; ignore
  })
}

/** POST /api/notices — create notice with file upload */
export async function createNotice(req, res) {
  try {
    const title = (req.body.title || '').trim()
    const durationDays = Number(req.body.duration_days)

    if (!title) {
      if (req.file) removeUploadedFile(req.file.path)
      return res.status(400).json({ error: 'Title is required.' })
    }

    if (!VALID_DURATIONS.has(durationDays)) {
      if (req.file) removeUploadedFile(req.file.path)
      return res.status(400).json({ error: 'Duration must be 30 or 60 days.' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'A file is required.' })
    }

    const fileType = getExtension(req.file.originalname)
    const fileUrl = `/uploads/${req.file.filename}`

    const notice = await Notice.create({
      title,
      file_url: fileUrl,
      file_type: fileType,
      file_path: req.file.path,
      upload_date: new Date(),
      expires_at: calculateExpiresAt(durationDays),
    })

    return res.status(201).json(notice)
  } catch (err) {
    if (req.file) removeUploadedFile(req.file.path)
    console.error('createNotice error:', err)
    return res.status(500).json({ error: 'Failed to create notice.' })
  }
}

/** GET /api/notices/admin — all notices (active + expired) */
export async function getAllNotices(_req, res) {
  try {
    const notices = await Notice.find().sort({ upload_date: -1 })
    return res.json(notices)
  } catch (err) {
    console.error('getAllNotices error:', err)
    return res.status(500).json({ error: 'Failed to fetch notices.' })
  }
}

/** GET /api/notices — active notices only (expires_at > now) */
export async function getActiveNotices(_req, res) {
  try {
    const notices = await Notice.find({
      expires_at: { $gt: new Date() },
    }).sort({ upload_date: -1 })

    return res.json(notices)
  } catch (err) {
    console.error('getActiveNotices error:', err)
    return res.status(500).json({ error: 'Failed to fetch active notices.' })
  }
}

/** DELETE /api/notices/:id — delete notice + file from storage */
export async function deleteNotice(req, res) {
  try {
    const notice = await Notice.findById(req.params.id)

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found.' })
    }

    const absolutePath = notice.file_path
      ? notice.file_path
      : path.join(uploadsDir, path.basename(notice.file_url))

    await Notice.findByIdAndDelete(notice._id)
    await removeUploadedFile(absolutePath)

    return res.json({ message: 'Notice deleted successfully.' })
  } catch (err) {
    console.error('deleteNotice error:', err)
    return res.status(500).json({ error: 'Failed to delete notice.' })
  }
}
