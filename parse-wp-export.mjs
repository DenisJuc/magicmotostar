import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const xmlPath = path.join(projectRoot, "data.xml")
const outPath = path.join(projectRoot, "lib", "motorcycles.ts")

const xml = fs.readFileSync(xmlPath, "utf8")
const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []

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

function getCategories(block) {
  const re =
    /<category[^>]*domain="([^"]+)"[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/category>/g
  const out = []
  let m
  while ((m = re.exec(block))) out.push({ domain: m[1], value: m[2].trim() })
  return out
}

function pickDomain(categories, domain) {
  return categories.find((c) => c.domain === domain)?.value ?? null
}

function stripHtml(s) {
  return String(s)
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\r?\n/g, "\n")
    .trim()
}

function escapeTemplateLiteral(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
}

function toTitleCase(s) {
  return String(s)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

// Build attachment id -> URL (for correct file extensions in paths)
const attachmentIdToUrl = new Map()
for (const it of items) {
  if (getCData(it, "wp:post_type") !== "attachment") continue
  const id = getTag(it, "wp:post_id")
  const url = getCData(it, "wp:attachment_url")
  if (!id || !url || !url.includes("magicmoto.ca/wp-content/uploads")) continue
  attachmentIdToUrl.set(id.trim(), url.trim())
}

function extFromUrl(url) {
  try {
    const ext = path.extname(new URL(url).pathname)
    return ext && /^\.(jpg|jpeg|png|gif|webp)$/i.test(ext) ? ext : ".jpg"
  } catch {
    return ".jpg"
  }
}

const products = []

for (const it of items) {
  if (getCData(it, "wp:post_type") !== "product") continue
  if (getCData(it, "wp:status") !== "publish") continue

  const slug = getCData(it, "wp:post_name")
  if (!slug) continue

  const title = getCData(it, "title") || slug
  const excerpt = getCData(it, "excerpt:encoded") || ""
  const description = stripHtml(excerpt)

  const kmFromText = (excerpt.match(/\bKM\s*:\s*(\d+)/i) || [])[1]
  const km = kmFromText ? Number(kmFromText) : null

  const video = (excerpt.match(/mp4="([^"]+)"/) || [])[1] || null

  const categories = getCategories(it)
  const yearStr = pickDomain(categories, "pa_model-year")
  const year = yearStr ? Number(yearStr) : null

  const engineStr = pickDomain(categories, "pa_engine-size")
  const engineSizeCc = engineStr ? Number(engineStr.replace(/[^\d]/g, "")) : null

  const statusRaw = pickDomain(categories, "pa_status")
  const conditionRaw = pickDomain(categories, "pa_condition")
  const brandRaw = pickDomain(categories, "product_cat")

  const brand = brandRaw ? toTitleCase(brandRaw) : ""
  const status = statusRaw ? toTitleCase(statusRaw) : ""
  const condition = conditionRaw ? toTitleCase(conditionRaw) : ""

  const priceStr =
    getMeta(it, "_price") || getMeta(it, "_regular_price") || "0"
  const price = Number(priceStr) || 0

  const thumbId = getMeta(it, "_thumbnail_id")
  const galleryIds = (getMeta(it, "_product_image_gallery") || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
  const imageIds = [...(thumbId ? [thumbId] : []), ...galleryIds]
  const images = imageIds
    .map((id) => attachmentIdToUrl.get(id))
    .filter(Boolean)
    .map((url, i) => {
      const n = String(i + 1).padStart(2, "0")
      return `/motorcycles/${slug}/${n}${extFromUrl(url)}`
    })
  if (images.length === 0) {
    images.push(`/motorcycles/${slug}/01.jpg`)
  }

  const make = brand || (title.split(" ")[0] ?? "")
  const model =
    brand && title.toLowerCase().startsWith(brand.toLowerCase() + " ")
      ? title.slice(brand.length).trim()
      : title

  products.push({
    id: slug,
    slug,
    make,
    model,
    year: year ?? 0,
    price,
    km: km ?? 0,
    engineSizeCc: engineSizeCc ?? 0,
    condition,
    status,
    brand: make,
    description,
    engineSoundVideo: `/motorcycles/${slug}/engine.mp4`,
    galleryImages: images,
    image: images[0],
  })
}

products.sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model))

const file = `// Generated from WordPress export (data.xml).
// Image/video paths are placeholders in /public; replace later.

export type Motorcycle = {
  id: string
  slug: string
  make: string
  model: string
  year: number
  price: number
  km: number
  engineSizeCc: number
  condition: string
  status: string
  brand: string
  description: string
  image: string
  galleryImages: string[]
  engineSoundVideo: string
}

export const motorcycles: Motorcycle[] = [
${products
  .map((p) => {
    return `  {
    id: \`${escapeTemplateLiteral(p.id)}\`,
    slug: \`${escapeTemplateLiteral(p.slug)}\`,
    make: \`${escapeTemplateLiteral(p.make)}\`,
    model: \`${escapeTemplateLiteral(p.model)}\`,
    year: ${p.year},
    price: ${p.price},
    km: ${p.km},
    engineSizeCc: ${p.engineSizeCc},
    condition: \`${escapeTemplateLiteral(p.condition)}\`,
    status: \`${escapeTemplateLiteral(p.status)}\`,
    brand: \`${escapeTemplateLiteral(p.brand)}\`,
    description: \`${escapeTemplateLiteral(p.description)}\`,
    image: \`${escapeTemplateLiteral(p.image)}\`,
    galleryImages: ${JSON.stringify(p.galleryImages)},
    engineSoundVideo: \`${escapeTemplateLiteral(p.engineSoundVideo)}\`,
  },`
  })
  .join("\n")}
]

export function getMotorcycleBySlug(slug: string) {
  return motorcycles.find((m) => m.slug === slug)
}

export function getRelatedMotorcycles(brand: string, slug: string, max = 3) {
  return motorcycles
    .filter((m) => m.brand === brand && m.slug !== slug)
    .slice(0, max)
}
`

fs.writeFileSync(outPath, file, "utf8")
console.log(`Wrote ${products.length} motorcycles to ${outPath}`)

