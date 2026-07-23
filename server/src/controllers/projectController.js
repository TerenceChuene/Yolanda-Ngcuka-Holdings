import path from 'path'
import { Project } from '../models/Project.js'
import { buildStoredFilename } from '../middleware/upload.js'
import { storeFile, deleteStoredFile } from '../storage/files.js'

const VALID_CATEGORIES = new Set(['feedlot', 'mining'])

function parseFields(body, { partial = false } = {}) {
  const pick = (key) => {
    if (partial && body[key] === undefined) return undefined
    return (body[key] || '').trim()
  }

  const title = pick('title')
  const subtitle = pick('subtitle')
  const meta = pick('meta')
  const description = pick('description')
  const categoryRaw = pick('category')
  const category = categoryRaw === undefined ? undefined : categoryRaw.toLowerCase()

  let sort_order
  if (body.sort_order === undefined || body.sort_order === '') {
    sort_order = undefined
  } else {
    sort_order = Number(body.sort_order)
  }

  return { title, subtitle, meta, description, category, sort_order }
}

function validateFields(fields, { requireAll }) {
  const { title, subtitle, meta, description, category, sort_order } = fields

  if (requireAll || title !== undefined) {
    if (!title) return 'Title is required.'
  }
  if (requireAll || subtitle !== undefined) {
    if (!subtitle) return 'Subtitle is required.'
  }
  if (requireAll || meta !== undefined) {
    if (!meta) return 'Meta is required.'
  }
  if (requireAll || description !== undefined) {
    if (!description) return 'Description is required.'
  }
  if (requireAll || category !== undefined) {
    if (!VALID_CATEGORIES.has(category)) {
      return 'Category must be feedlot or mining.'
    }
  }
  if (sort_order !== undefined && Number.isNaN(sort_order)) {
    return 'Sort order must be a number.'
  }
  return null
}


/** GET /api/projects — public project list */
export async function getProjects(_req, res) {
  try {
    const projects = await Project.find().sort({ sort_order: 1, created_at: -1 })
    return res.json(projects)
  } catch (err) {
    console.error('getProjects error:', err)
    return res.status(500).json({ error: 'Failed to fetch projects.' })
  }
}

/** GET /api/projects/admin — all projects (same list; auth required) */
export async function getAllProjects(_req, res) {
  try {
    const projects = await Project.find().sort({ sort_order: 1, created_at: -1 })
    return res.json(projects)
  } catch (err) {
    console.error('getAllProjects error:', err)
    return res.status(500).json({ error: 'Failed to fetch projects.' })
  }
}

/** POST /api/projects — create project with image upload */
export async function createProject(req, res) {
  try {
    const fields = parseFields(req.body)
    const error = validateFields(fields, { requireAll: true })
    if (error) {
      return res.status(400).json({ error })
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ error: 'An image is required.' })
    }

    const filename = buildStoredFilename(req.file.originalname)
    const stored = await storeFile({
      buffer: req.file.buffer,
      filename,
      contentType: req.file.mimetype,
    })

    const nextOrder =
      fields.sort_order !== undefined
        ? fields.sort_order
        : ((await Project.findOne().sort({ sort_order: -1 }).select('sort_order'))
            ?.sort_order ?? -1) + 1

    const project = await Project.create({
      title: fields.title,
      subtitle: fields.subtitle,
      meta: fields.meta,
      description: fields.description,
      category: fields.category,
      image_url: `/uploads/${filename}`,
      image_path: stored.id,
      sort_order: nextOrder,
    })

    return res.status(201).json(project)
  } catch (err) {
    console.error('createProject error:', err)
    return res.status(500).json({ error: 'Failed to create project.' })
  }
}

/** PUT /api/projects/:id — update project (image optional) */
export async function updateProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' })
    }

    const fields = parseFields(req.body, { partial: true })
    const merged = {
      title: fields.title ?? project.title,
      subtitle: fields.subtitle ?? project.subtitle,
      meta: fields.meta ?? project.meta,
      description: fields.description ?? project.description,
      category: fields.category ?? project.category,
      sort_order: fields.sort_order,
    }
    const error = validateFields(merged, { requireAll: true })
    if (error) {
      return res.status(400).json({ error })
    }

    if (fields.title !== undefined) project.title = fields.title
    if (fields.subtitle !== undefined) project.subtitle = fields.subtitle
    if (fields.meta !== undefined) project.meta = fields.meta
    if (fields.description !== undefined) project.description = fields.description
    if (fields.category !== undefined) project.category = fields.category
    if (fields.sort_order !== undefined) project.sort_order = fields.sort_order

    if (req.file?.buffer) {
      const oldFilename = path.basename(project.image_url)
      const oldId = project.image_path
      const filename = buildStoredFilename(req.file.originalname)
      const stored = await storeFile({
        buffer: req.file.buffer,
        filename,
        contentType: req.file.mimetype,
      })
      project.image_url = `/uploads/${filename}`
      project.image_path = stored.id

      await deleteStoredFile({
        fileId: oldId,
        filename: oldFilename,
        filePath: oldId?.includes(path.sep) ? oldId : null,
      })
    }

    await project.save()
    return res.json(project)
  } catch (err) {
    console.error('updateProject error:', err)
    return res.status(500).json({ error: 'Failed to update project.' })
  }
}

/** DELETE /api/projects/:id — delete project + image */
export async function deleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' })
    }

    const filename = path.basename(project.image_url)

    await Project.findByIdAndDelete(project._id)
    await deleteStoredFile({
      fileId: project.image_path,
      filename,
      filePath: project.image_path?.includes(path.sep) ? project.image_path : null,
    })

    return res.json({ message: 'Project deleted successfully.' })
  } catch (err) {
    console.error('deleteProject error:', err)
    return res.status(500).json({ error: 'Failed to delete project.' })
  }
}
