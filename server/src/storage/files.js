import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { GridFSBucket, ObjectId } from 'mongodb'
import { uploadsDir } from '../middleware/upload.js'

const BUCKET = 'noticeFiles'

function getBucket() {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB is not connected')
  }
  return new GridFSBucket(mongoose.connection.db, { bucketName: BUCKET })
}

function contentTypeFor(filename) {
  const ext = path.extname(filename).slice(1).toLowerCase()
  const map = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  }
  return map[ext] || 'application/octet-stream'
}

/** Persist an uploaded buffer in GridFS (survives container restarts). */
export function storeFile({ buffer, filename, contentType }) {
  return new Promise((resolve, reject) => {
    const bucket = getBucket()
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: { originalName: filename },
    })

    uploadStream.on('error', reject)
    uploadStream.on('finish', () => {
      resolve({
        id: uploadStream.id.toString(),
        filename,
      })
    })
    uploadStream.end(buffer)
  })
}

async function findByFilename(filename) {
  const bucket = getBucket()
  const files = await bucket.find({ filename }).limit(1).toArray()
  return files[0] || null
}

/**
 * Copy any leftover disk uploads into GridFS so local/legacy files
 * keep working after switching off express.static.
 */
export async function migrateDiskUploadsToGridFS() {
  let entries
  try {
    entries = await fs.promises.readdir(uploadsDir)
  } catch {
    return
  }

  for (const name of entries) {
    if (name.startsWith('.')) continue
    const fullPath = path.join(uploadsDir, name)
    let stat
    try {
      stat = await fs.promises.stat(fullPath)
    } catch {
      continue
    }
    if (!stat.isFile()) continue

    const existing = await findByFilename(name)
    if (existing) continue

    const buffer = await fs.promises.readFile(fullPath)
    await storeFile({
      buffer,
      filename: name,
      contentType: contentTypeFor(name),
    })
    console.log(`Migrated upload to GridFS: ${name}`)
  }
}

/** Stream a file to the response from GridFS, or fall back to local disk. */
export async function sendStoredFile(filename, res) {
  const safeName = path.basename(filename)

  try {
    const file = await findByFilename(safeName)
    if (file) {
      res.setHeader(
        'Content-Type',
        file.contentType || 'application/octet-stream',
      )
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${safeName}"`,
      )
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

      const downloadStream = getBucket().openDownloadStream(file._id)
      downloadStream.on('error', () => {
        if (!res.headersSent) {
          res.status(404).json({ error: 'File not found.' })
        } else {
          res.end()
        }
      })
      downloadStream.pipe(res)
      return
    }
  } catch (err) {
    console.error('GridFS lookup error:', err)
  }

  // Local-dev fallback for files uploaded before GridFS.
  const diskPath = path.join(uploadsDir, safeName)
  try {
    await fs.promises.access(diskPath)
    return res.sendFile(diskPath)
  } catch {
    return res.status(404).json({ error: 'File not found.' })
  }
}

/** Remove a file from GridFS and/or disk. */
export async function deleteStoredFile({ fileId, filename, filePath }) {
  const safeName = filename ? path.basename(filename) : null

  try {
    const bucket = getBucket()

    if (fileId && ObjectId.isValid(fileId)) {
      try {
        await bucket.delete(new ObjectId(fileId))
      } catch {
        // Already gone
      }
    } else if (safeName) {
      const file = await findByFilename(safeName)
      if (file) {
        try {
          await bucket.delete(file._id)
        } catch {
          // Already gone
        }
      }
    }
  } catch (err) {
    console.error('GridFS delete error:', err)
  }

  const diskCandidates = [
    filePath,
    safeName ? path.join(uploadsDir, safeName) : null,
  ].filter(Boolean)

  await Promise.all(
    diskCandidates.map((p) =>
      fs.promises.unlink(p).catch(() => {
        // File may already be gone
      }),
    ),
  )
}
