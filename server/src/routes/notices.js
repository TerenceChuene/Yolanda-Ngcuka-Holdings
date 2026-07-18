import { Router } from 'express'
import { upload } from '../middleware/upload.js'
import { requireAuth } from '../middleware/auth.js'
import {
  createNotice,
  getAllNotices,
  getActiveNotices,
  deleteNotice,
} from '../controllers/noticeController.js'

const router = Router()

// Public: active notices only
router.get('/', getActiveNotices)

// Admin: all notices (auth required)
router.get('/admin', requireAuth, getAllNotices)

// Admin: create notice (multipart, auth required)
router.post('/', requireAuth, upload.single('file'), createNotice)

// Admin: delete notice + file (auth required)
router.delete('/:id', requireAuth, deleteNotice)

export default router
