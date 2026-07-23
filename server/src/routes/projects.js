import { Router } from 'express'
import { uploadImage } from '../middleware/upload.js'
import { requireAuth } from '../middleware/auth.js'
import {
  createProject,
  getProjects,
  getAllProjects,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js'

const router = Router()

// Public: all projects
router.get('/', getProjects)

// Admin: all projects (auth required)
router.get('/admin', requireAuth, getAllProjects)

// Admin: create project (multipart image, auth required)
router.post('/', requireAuth, uploadImage.single('image'), createProject)

// Admin: update project (image optional)
router.put('/:id', requireAuth, uploadImage.single('image'), updateProject)

// Admin: delete project + image
router.delete('/:id', requireAuth, deleteProject)

export default router
