#!/usr/bin/env node
/**
 * Import new bikes from Desktop moto-info (moto-2..moto-10).
 * main_image → 01 (cover), other images → 02+, video → engine.mp4
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const SRC = "C:\\Users\\Denis\\Desktop\\moto-info"
const PUBLIC_MOTO = path.join(ROOT, "public", "motorcycles")
const LIB = path.join(ROOT, "lib", "motorcycles.ts")

/** Manual overrides where info.txt is incomplete or needs cleanup */
const OVERRIDES = {
  "moto-2": {
    title: "Harley-Davidson Road King",
    year: 2021,
    km: 63234,
    price: 16350,
    engineSizeCc: 1746,
    make: "Harley-Davidson",
    model: "Road King",
    brand: "Harley-Davidson",
    notes: "Identified from photos as Road King; 2021 base FLHR uses Milwaukee-Eight 107 (1746cc). Confirm if yours is a 114 Special.",
  },
  "moto-3": {
    title: "Indian Scout Bobber",
    year: 2024,
    km: 5450,
    price: 10900,
    engineSizeCc: 1133,
    make: "Indian",
    model: "Scout Bobber",
    brand: "Indian",
    notes: "2024 Scout Bobber standard is 1133cc (not Scout Bobber Sixty 999cc).",
  },
  "moto-4": {
    title: "Suzuki Boulevard C50T",
    year: 2013,
    km: 19669,
    price: 5750,
    engineSizeCc: 805,
    make: "Suzuki",
    model: "Boulevard C50T",
    brand: "Suzuki",
  },
  "moto-5": {
    title: "Suzuki Boulevard C109RT",
    year: 2008,
    km: 45959,
    price: 8850,
    engineSizeCc: 1783,
    make: "Suzuki",
    model: "Boulevard C109RT",
    brand: "Suzuki",
    notes: "info.txt said C19RT — treated as C109RT from photos/title.",
  },
  "moto-6": {
    title: "Honda Fury",
    year: 2017,
    km: 23196,
    price: 8950,
    engineSizeCc: 1300,
    make: "Honda",
    model: "Fury",
    brand: "Honda",
  },
  "moto-7": {
    title: "Yamaha Stryker",
    year: 2014,
    km: 31318,
    price: 8850,
    engineSizeCc: 1300,
    make: "Yamaha",
    model: "Stryker",
    brand: "Yamaha",
  },
  "moto-8": {
    title: "Kawasaki Vulcan Classic",
    year: 2014,
    km: 34316,
    price: 6450,
    engineSizeCc: 900,
    make: "Kawasaki",
    model: "Vulcan Classic",
    brand: "Kawasaki",
    notes: "Looks like Vulcan 900 Classic LT (903cc → listed as 900). Confirm if 1700.",
  },
  "moto-9": {
    title: "Kawasaki Vulcan Classic",
    year: 2015,
    km: 23995,
    price: 6750,
    engineSizeCc: 900,
    make: "Kawasaki",
    model: "Vulcan Classic",
    brand: "Kawasaki",
    notes: "Looks like Vulcan 900 Classic LT (903cc → listed as 900). Confirm if 1700.",
  },
  "moto-10": {
    title: "Kawasaki Vulcan Classic",
    year: 2012,
    km: 23000,
    price: 5650,
    engineSizeCc: 900,
    make: "Kawasaki",
    model: "Vulcan Classic",
    brand: "Kawasaki",
    notes: "Looks like Vulcan 900 Classic LT (903cc → listed as 900). Confirm if 1700.",
  },
}

function slugify(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function getExistingSlugs() {
  const content = fs.readFileSync(LIB, "utf8")
  const slugs = []
  const re = /slug:\s*`([^`]+)`/g
  let m
  while ((m = re.exec(content)) !== null) slugs.push(m[1])
  return slugs
}

function ensureUniqueSlug(base, existing) {
  let slug = base
  let n = 1
  while (existing.includes(slug)) slug = `${base}-${++n}`
  return slug
}

function copyMedia(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  const files = fs.readdirSync(srcDir)
  const main = files.find((f) => /^main_image\./i.test(f))
  if (!main) throw new Error(`No main_image in ${srcDir}`)

  const mainExt = path.extname(main).toLowerCase() || ".png"
  const coverName = `01${mainExt}`
  fs.copyFileSync(path.join(srcDir, main), path.join(destDir, coverName))

  const extras = files
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !/^main_image\./i.test(f) && !/^info\.txt$/i.test(f))
    .sort()

  const gallery = [`/motorcycles/${path.basename(destDir)}/${coverName}`]
  let i = 2
  for (const f of extras) {
    const ext = path.extname(f).toLowerCase()
    const name = `${String(i).padStart(2, "0")}${ext}`
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, name))
    gallery.push(`/motorcycles/${path.basename(destDir)}/${name}`)
    i++
  }

  const video = files.find((f) => /\.(mp4|mov|webm)$/i.test(f))
  if (video) {
    fs.copyFileSync(path.join(srcDir, video), path.join(destDir, "engine.mp4"))
  }

  return {
    image: `/motorcycles/${path.basename(destDir)}/${coverName}`,
    galleryImages: gallery,
    engineSoundVideo: `/motorcycles/${path.basename(destDir)}/engine.mp4`,
    hasVideo: Boolean(video),
  }
}

function formatEntry(e) {
  return `  {
    id: \`${e.id}\`,
    slug: \`${e.slug}\`,
    make: \`${e.make}\`,
    model: \`${e.model}\`,
    year: ${e.year},
    price: ${e.price},
    km: ${e.km},
    engineSizeCc: ${e.engineSizeCc},
    condition: \`Like New\`,
    status: \`In Stock\`,
    brand: \`${e.brand}\`,
    description: \`\`,
    image: \`${e.image}\`,
    galleryImages: [${e.galleryImages.map((x) => `"${x}"`).join(",")}],
    engineSoundVideo: \`${e.engineSoundVideo}\`,
  }`
}

const existing = getExistingSlugs()
const entries = []
const warnings = []

warnings.push(
  "SKIPPED moto-1: info.txt is empty (no year/km/price). Photos look like a Suzuki Boulevard M109R (~1783cc). Fill info.txt and re-run."
)

for (const key of Object.keys(OVERRIDES).sort((a, b) => {
  const na = parseInt(a.replace(/\D/g, ""), 10)
  const nb = parseInt(b.replace(/\D/g, ""), 10)
  return na - nb
})) {
  const o = OVERRIDES[key]
  const srcDir = path.join(SRC, key)
  if (!fs.existsSync(srcDir)) {
    warnings.push(`Missing folder ${key}`)
    continue
  }

  const baseSlug = slugify(o.title)
  const slug = ensureUniqueSlug(baseSlug, existing)
  existing.push(slug)

  const destDir = path.join(PUBLIC_MOTO, slug)
  const media = copyMedia(srcDir, destDir)

  entries.push({
    id: slug,
    slug,
    make: o.make,
    model: o.model,
    brand: o.brand,
    year: o.year,
    price: o.price,
    km: o.km,
    engineSizeCc: o.engineSizeCc,
    ...media,
  })

  if (o.notes) warnings.push(`${slug}: ${o.notes}`)
  console.log(`OK ${key} → ${slug} (${o.engineSizeCc}cc) video=${media.hasVideo}`)
}

let lib = fs.readFileSync(LIB, "utf8")
const insertAt = lib.lastIndexOf("\n]")
if (insertAt === -1) throw new Error("Could not find end of motorcycles array")

const block = entries.map(formatEntry).join(",\n") + ","
lib = lib.slice(0, insertAt) + "\n" + block + lib.slice(insertAt)
fs.writeFileSync(LIB, lib)

console.log("\n--- WARNINGS ---")
for (const w of warnings) console.log("- " + w)
console.log(`\nAdded ${entries.length} motorcycles.`)
