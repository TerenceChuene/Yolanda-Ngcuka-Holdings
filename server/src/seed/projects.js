import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Project } from '../models/Project.js'
import { storeFile } from '../storage/files.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SEED = [
  {
    title: 'Feedlot Projects',
    subtitle: 'VPS Gauteng — 2025',
    meta: 'Gauteng · 2025',
    category: 'feedlot',
    imageFile: 'project-1.webp',
    description:
      'Environmental authorisation and compliance management for multiple feedlot operations in Gauteng, including development of environmental management plans, regulatory submissions, monitoring programmes, and rehabilitation strategies to minimise environmental impacts and support sustainable agricultural operations.',
    sort_order: 0,
  },
  {
    title: 'Molobeng Coal Mining',
    subtitle: 'Vryheid, KwaZulu-Natal — 2024',
    meta: 'Vryheid, KwaZulu-Natal · 2024',
    category: 'mining',
    imageFile: 'project-2.webp',
    description:
      'Environmental management and rehabilitation planning for coal mining operations, including water quality monitoring, biodiversity assessments, and progressive rehabilitation strategies.',
    sort_order: 1,
  },
  {
    title: 'Dundee Mining',
    subtitle: 'Kuruman, Northern Cape — 2023',
    meta: 'Kuruman, Northern Cape · 2023',
    category: 'mining',
    imageFile: 'project-3.webp',
    description:
      'Comprehensive environmental auditing and monitoring services for active mining operations, ensuring ongoing regulatory compliance and environmental performance tracking.',
    sort_order: 2,
  },
  {
    title: 'Dandee Mining',
    subtitle: 'Kenhardt, Northern Cape — 2023',
    meta: 'Kenhardt, Northern Cape · 2023',
    category: 'mining',
    imageFile: 'project-4.webp',
    description:
      'Environmental authorisation and compliance management for mining operations in the Northern Cape region, including full EA application and environmental management programme development.',
    sort_order: 3,
  },
]

function resolveImagePath(imageFile) {
  const candidates = [
    path.resolve(__dirname, '../../../src/assets/optimized', imageFile),
    path.resolve(__dirname, '../../../dist/assets', imageFile),
    path.resolve(__dirname, '../../seed-assets', imageFile),
  ]
  return candidates
}

/**
 * If the projects collection is empty, seed the four portfolio projects
 * from local webp assets (dev / first deploy).
 */
export async function ensureSeedProjects() {
  const count = await Project.countDocuments()
  if (count > 0) return

  for (const item of SEED) {
    let buffer = null
    let usedPath = null

    for (const candidate of resolveImagePath(item.imageFile)) {
      try {
        buffer = await fs.readFile(candidate)
        usedPath = candidate
        break
      } catch {
        // try next
      }
    }

    if (!buffer) {
      console.warn(
        `Seed skipped for "${item.title}": image ${item.imageFile} not found.`,
      )
      continue
    }

    const filename = `seed-${item.sort_order}-${item.imageFile}`
    const stored = await storeFile({
      buffer,
      filename,
      contentType: 'image/webp',
    })

    await Project.create({
      title: item.title,
      subtitle: item.subtitle,
      meta: item.meta,
      description: item.description,
      category: item.category,
      image_url: `/uploads/${filename}`,
      image_path: stored.id,
      sort_order: item.sort_order,
    })

    console.log(`Seeded project "${item.title}" from ${usedPath}`)
  }
}
