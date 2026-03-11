const fs = require("fs")

const XML_PATH = "c:/Users/Denis/Downloads/data.xml"

const xml = fs.readFileSync(XML_PATH, "utf8")
const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []

function esc(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${")
}

function getCData(block, tag) {
  const re = new RegExp(
    `<${tag}><!\\\\[CDATA\\\\[([\\\\s\\\\S]*?)\\\\]\\\\]><\\\\/${tag}>`
  )
  const m = block.match(re)
  return m ? m[1].trim() : null
}

function getTag(block, tag) {
  const re = new RegExp(`<${tag}>([\\\\s\\\\S]*?)<\\\\/${tag}>`)
  const m = block.match(re)
  return m ? m[1].trim() : null
}

function getMeta(block, key) {
  const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
  const re = new RegExp(
    `<wp:postmeta>[\\\\s\\\\S]*?<wp:meta_key><!\\\\[CDATA\\\\[${escapedKey}\\\\]\\\\]><\\\\/wp:meta_key>[\\\\s\\\\S]*?<wp:meta_value><!\\\\[CDATA\\\\[([\\\\s\\\\S]*?)\\\\]\\\\]><\\\\/wp:meta_value>[\\\\s\\\\S]*?<\\\\/wp:postmeta>`
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
  return categories.filter((c) => c.domain === domain).map((c) => c.value)
}

function stripHtml(s) {
  return String(s)
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\r?\n/g, "\n")
    .trim()
}

const attachments = new Map()
for (const it of items) {
  if (getCData(it, "wp:post_type") !== "attachment") continue
  const id = Number(getTag(it, "wp:post_id"))
  const url = getTag(it, "wp:attachment_url")
  if (id && url) attachments.set(id, url.trim())
}

const products = []
for (const it of items) {
  if (getCData(it, "wp:post_type") !== "product") continue
  if (getCData(it, "wp:status") !== "publish") continue

  const slug = getCData(it, "wp:post_name")
  const title = getCData(it, "title") || slug
  const excerpt = getCData(it, "excerpt:encoded") || ""
  const description = stripHtml(excerpt)
  const video = (excerpt.match(/mp4="([^"]+)"/) || [])[1] || null
  const kmFromText = (excerpt.match(/\bKM\s*:\s*(\d+)/i) || [])[1]

  const categories = getCategories(it)
  const yearStr = pickDomain(categories, "pa_model-year")[0] || null
  const engineStr = pickDomain(categories, "pa_engine-size")[0] || null
  const status = pickDomain(categories, "pa_status")[0] || null
  const condition = pickDomain(categories, "pa_condition")[0] || null
  const brand = pickDomain(categories, "product_cat")[0] || null

  const priceStr = getMeta(it, "_price") || getMeta(it, "_regular_price") || "0"
  const price = Number(priceStr) || 0
  const year = yearStr ? Number(yearStr) : 0
  const engineSizeCc = engineStr ? Number(engineStr.replace(/[^\d]/g, "")) : 0
  const km = kmFromText ? Number(kmFromText) : 0

  const thumbId = getMeta(it, "_thumbnail_id")
  const gallery = getMeta(it, "_product_image_gallery")
  const ids = [
    ...(thumbId ? [thumbId] : []),
    ...(gallery ? gallery.split(",") : []),
  ]
    .map((x) => Number(x))
    .filter(Boolean)
  const remoteImages = ids.map((id) => attachments.get(id)).filter(Boolean)

  const placeholderCount = Math.max(3, remoteImages.length || 0)
  const images = Array.from({ length: placeholderCount }, (_, i) => {
    const n = String(i + 1).padStart(2, "0")
    return `/motorcycles/${slug}/${n}.jpg`
  })

  products.push({
    slug,
    title,
    brand: brand || "",
    year,
    price,
    km,
    engineSizeCc,
    condition: condition || "",
    status: status || "",
    description,
    engineSoundVideo: video ? video : `/motorcycles/${slug}/engine.mp4`,
    images,
  })
}

products.sort(
  (a, b) => a.brand.localeCompare(b.brand) || a.title.localeCompare(b.title)
)

const lines = []
lines.push("// Auto-generated from WordPress export (data.xml)")
lines.push("// Images are placeholder paths under /public for now.")
lines.push("")
lines.push("export type Motorcycle = {")
lines.push("  slug: string")
lines.push("  title: string")
lines.push("  brand: string")
lines.push("  year: number")
lines.push("  price: number")
lines.push("  km: number")
lines.push("  engineSizeCc: number")
lines.push('  condition: "New" | "Used" | "Like New" | string')
lines.push('  status: "In stock" | "Out of stock" | string')
lines.push("  description: string")
lines.push("  engineSoundVideo: string")
lines.push("  images: string[]")
lines.push("}")
lines.push("")
lines.push("export const motorcycles: Motorcycle[] = [")

for (const p of products) {
  if (!p.slug) throw new Error("slug missing")
  lines.push("  {")
  lines.push(`    slug: \`${esc(p.slug)}\`,`)
  lines.push(`    title: \`${esc(p.title)}\`,`)
  lines.push(`    brand: \`${esc(p.brand)}\`,`)
  lines.push(`    year: ${p.year},`)
  lines.push(`    price: ${p.price},`)
  lines.push(`    km: ${p.km},`)
  lines.push(`    engineSizeCc: ${p.engineSizeCc},`)
  lines.push(`    condition: \`${esc(p.condition)}\`,`)
  lines.push(`    status: \`${esc(p.status)}\`,`)
  lines.push(`    description: \`${esc(p.description)}\`,`)
  lines.push(`    engineSoundVideo: \`${esc(p.engineSoundVideo)}\`,`)
  lines.push(`    images: ${JSON.stringify(p.images)},`)
  lines.push("  },")
}

lines.push("]")
lines.push("")

process.stdout.write(lines.join("\n"))

