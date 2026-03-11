/**
 * download-media.mjs
 * Parses data.xml, extracts WordPress media URLs (magicmoto.ca/wp-content/uploads),
 * and downloads images/videos into public/motorcycles/[slug]/ with correct filenames.
 */

import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const xmlPath = path.join(projectRoot, "data.xml")
const publicDir = path.join(projectRoot, "public")
const motorcyclesDir = path.join(publicDir, "motorcycles")

const DELAY_MS = 300

function getCData(block, tag) {
  const re = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`)
  const m = block.match(re)
  return m ? m[1].trim() : null
}

function getTag(block, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`)
  const m = block.match(re)
  return m ? m[1].trim() : null
}

function getMeta(block, key) {
  const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
  const re = new RegExp(
    `<wp:postmeta>[\\s\\S]*?<wp:meta_key><!\\[CDATA\\[${escapedKey}\\]\\]></wp:meta_key>[\\s\\S]*?<wp:meta_value><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></wp:meta_value>[\\s\\S]*?</wp:postmeta>`
  )
  const m = block.match(re)
  return m ? m[1].trim() : null
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function download(url, destPath) {
  const res = await fetch(url, { redirect: "follow" })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(destPath, buf)
}

const xml = fs.readFileSync(xmlPath, "utf8")
const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []

// Build attachment id -> URL (only magicmoto.ca wp-content/uploads)
const attachmentIdToUrl = new Map()
for (const it of items) {
  if (getCData(it, "wp:post_type") !== "attachment") continue
  const id = getTag(it, "wp:post_id")
  const url = getCData(it, "wp:attachment_url")
  if (!id || !url || !url.includes("magicmoto.ca/wp-content/uploads")) continue
  attachmentIdToUrl.set(id.trim(), url.trim())
}

// Build per-product: slug -> { imageUrls: string[], videoUrl: string | null }
const productMedia = []
for (const it of items) {
  if (getCData(it, "wp:post_type") !== "product") continue
  if (getCData(it, "wp:status") !== "publish") continue

  const slug = getCData(it, "wp:post_name")
  if (!slug) continue

  const excerpt = getCData(it, "excerpt:encoded") || ""
  const videoUrl = (excerpt.match(/mp4="([^"]+)"/) || [])[1] || null
  const videoUrlFiltered =
    videoUrl && videoUrl.includes("magicmoto.ca/wp-content/uploads")
      ? videoUrl
      : null

  const thumbId = getMeta(it, "_thumbnail_id")
  const galleryIds = (getMeta(it, "_product_image_gallery") || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
  const imageIds = [...(thumbId ? [thumbId] : []), ...galleryIds]
  const imageUrls = imageIds
    .map((id) => attachmentIdToUrl.get(id))
    .filter(Boolean)

  productMedia.push({
    slug,
    imageUrls,
    videoUrl: videoUrlFiltered,
  })
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}
if (!fs.existsSync(motorcyclesDir)) {
  fs.mkdirSync(motorcyclesDir, { recursive: true })
}

let downloaded = 0
let skipped = 0
let failed = 0

for (const { slug, imageUrls, videoUrl } of productMedia) {
  const dir = path.join(motorcyclesDir, slug)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    const ext = path.extname(new URL(url).pathname) || ".jpg"
    const basename = String(i + 1).padStart(2, "0") + ext
    const destPath = path.join(dir, basename)

    try {
      if (fs.existsSync(destPath)) {
        skipped++
        continue
      }
      await download(url, destPath)
      downloaded++
      console.log(`  ${slug}/${basename}`)
    } catch (err) {
      failed++
      console.error(`  FAIL ${slug}/${basename}: ${err.message}`)
    }
    await sleep(DELAY_MS)
  }

  if (videoUrl) {
    const destPath = path.join(dir, "engine.mp4")
    try {
      if (fs.existsSync(destPath)) {
        skipped++
      } else {
        await download(videoUrl, destPath)
        downloaded++
        console.log(`  ${slug}/engine.mp4`)
      }
    } catch (err) {
      failed++
      console.error(`  FAIL ${slug}/engine.mp4: ${err.message}`)
    }
    await sleep(DELAY_MS)
  }
}

console.log(
  `\nDone. Downloaded: ${downloaded}, skipped (exists): ${skipped}, failed: ${failed}`
)
