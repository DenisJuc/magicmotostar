#!/usr/bin/env node
/**
 * Import motorcycles from Desktop moto-info (Sept 2025 batch).
 * First image → 01 cover, remaining images → gallery, video → engine.mp4
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const SRC = "C:\\Users\\Denis\\Desktop\\moto-info"
const PUBLIC_MOTO = path.join(ROOT, "public", "motorcycles")
const LIB = path.join(ROOT, "lib", "motorcycles.ts")
const EN_DESC = path.join(ROOT, "lib", "motorcycle-descriptions-en.ts")

const BIKES = [
  {
    folder: "moto-1",
    slug: "suzuki-boulevard-c90t-2",
    make: "Suzuki",
    model: "Boulevard C90T",
    brand: "Suzuki",
    year: 2019,
    km: 16458,
    price: 9100,
    engineSizeCc: 1500,
    descriptionRo: "",
    descriptionEn: "",
  },
  {
    folder: "moto-2",
    slug: "kawasaki-nomad-vn17-2",
    make: "Kawasaki",
    model: "Nomad VN17",
    brand: "Kawasaki",
    year: 2011,
    km: 38575,
    price: 6800,
    engineSizeCc: 1700,
    descriptionRo: "",
    descriptionEn: "",
  },
  {
    folder: "moto-3",
    slug: "honda-vt-stateline",
    make: "Honda",
    model: "VT Stateline",
    brand: "Honda",
    year: 2011,
    km: 49000,
    price: 6700,
    engineSizeCc: 1300,
    descriptionRo: "ABS inclus.",
    descriptionEn: "ABS included.",
  },
  {
    folder: "moto-4",
    slug: "kawasaki-vulcan-vaquero-2",
    make: "Kawasaki",
    model: "Vulcan Vaquero",
    brand: "Kawasaki",
    year: 2014,
    km: 67564,
    price: 8500,
    engineSizeCc: 1700,
    descriptionRo: "",
    descriptionEn: "",
  },
  {
    folder: "moto-5",
    slug: "custom-kawasaki-vulcan-3",
    make: "Custom",
    model: "Kawasaki Vulcan",
    brand: "Custom",
    year: 2011,
    km: 34500,
    price: 5200,
    engineSizeCc: 900,
    descriptionRo: "",
    descriptionEn: "",
  },
  {
    folder: "moto-6",
    slug: "kawasaki-voyager-vn170-2",
    make: "Kawasaki",
    model: "Voyager VN170",
    brand: "Kawasaki",
    year: 2011,
    km: 73000,
    price: 6850,
    engineSizeCc: 1700,
    descriptionRo: "",
    descriptionEn: "",
  },
  {
    folder: "moto-7",
    slug: "suzuki-boulevard-m109r-8",
    make: "Suzuki",
    model: "Boulevard M109R",
    brand: "Suzuki",
    year: 2007,
    km: 29452,
    price: 6800,
    engineSizeCc: 1800,
    descriptionRo: "",
    descriptionEn: "",
  },
  {
    folder: "moto-8",
    slug: "honda-vtx-1300-3",
    make: "Honda",
    model: "VTX 1300",
    brand: "Honda",
    year: 2007,
    km: 60100,
    price: 5200,
    engineSizeCc: 1300,
    descriptionRo: "",
    descriptionEn: "",
  },
  {
    folder: "moto-9",
    slug: "suzuki-boulevard-m109r-boss",
    make: "Suzuki",
    model: "Boulevard M109R BOSS",
    brand: "Suzuki",
    year: 2016,
    km: 18709,
    price: 12650,
    // Official 2016 M109R B.O.S.S. displacement is 1783cc (not 1700)
    engineSizeCc: 1783,
    descriptionRo: `Suzuki Boulevard M109R BOSS, un cruiser cu o personalitate aparte, foarte bine întreținut. An: 2016, cu un rulaj de 18709 km. Poți să îl rezervi — bineînțeles dacă te grăbești — foarte puține pe piață. Se vinde cu vama achitată și toate actele necesare în vederea înmatriculării.

Info: WhatsApp +1 514 415 4612`,
    descriptionEn: `Suzuki Boulevard M109R BOSS — a cruiser with a distinctive character, very well maintained. Year: 2016, with only 18,709 km. You can reserve it — if you hurry; there are very few like it on the market. Sold with customs paid and all documents needed for registration.

Info: WhatsApp +1 514 415 4612`,
  },
]

function copyMedia(srcDir, destDir, slug) {
  fs.mkdirSync(destDir, { recursive: true })
  const files = fs.readdirSync(srcDir)

  const images = files
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !/^info\.txt$/i.test(f))
    .sort()
  if (images.length === 0) throw new Error(`No images in ${srcDir}`)

  const gallery = []
  images.forEach((f, idx) => {
    const ext = path.extname(f).toLowerCase()
    const name = `${String(idx + 1).padStart(2, "0")}${ext}`
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, name))
    gallery.push(`/motorcycles/${slug}/${name}`)
  })

  const video = files.find((f) => /\.(mp4|mov|webm)$/i.test(f))
  if (video) {
    fs.copyFileSync(path.join(srcDir, video), path.join(destDir, "engine.mp4"))
  }

  return {
    image: gallery[0],
    galleryImages: gallery,
    engineSoundVideo: `/motorcycles/${slug}/engine.mp4`,
    hasVideo: Boolean(video),
  }
}

function escapeTicks(s) {
  return (s || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`")
}

function formatEntry(e) {
  return `  {
    id: \`${e.slug}\`,
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
    description: \`${escapeTicks(e.descriptionRo)}\`,
    image: \`${e.image}\`,
    galleryImages: [${e.galleryImages.map((x) => `"${x}"`).join(",")}],
    engineSoundVideo: \`${e.engineSoundVideo}\`,
  }`
}

const existing = fs.readFileSync(LIB, "utf8")
const existingSlugs = [...existing.matchAll(/slug:\s*`([^`]+)`/g)].map((m) => m[1])

const entries = []
const enEntries = []

for (const bike of BIKES) {
  if (existingSlugs.includes(bike.slug)) {
    throw new Error(`Slug already exists: ${bike.slug}`)
  }
  const srcDir = path.join(SRC, bike.folder)
  if (!fs.existsSync(srcDir)) throw new Error(`Missing ${srcDir}`)

  const destDir = path.join(PUBLIC_MOTO, bike.slug)
  const media = copyMedia(srcDir, destDir, bike.slug)
  entries.push({ ...bike, ...media })
  if (bike.descriptionEn) {
    enEntries.push({ slug: bike.slug, text: bike.descriptionEn })
  }
  console.log(`OK ${bike.folder} → ${bike.slug} (${bike.engineSizeCc}cc) images=${media.galleryImages.length} video=${media.hasVideo}`)
}

// Insert into motorcycles array (before first standalone ] after last bike)
const gold = existing.lastIndexOf("id: `honda-goldwing-2024`")
const closeArr = existing.indexOf("\n]", gold)
if (closeArr === -1) throw new Error("Could not find array end")

const block = entries.map(formatEntry).join(",\n") + ","
let next = existing.slice(0, closeArr) + "\n" + block + existing.slice(closeArr)
fs.writeFileSync(LIB, next)

// Append EN descriptions
if (enEntries.length) {
  let en = fs.readFileSync(EN_DESC, "utf8")
  const insertAt = en.lastIndexOf("\n}")
  if (insertAt === -1) throw new Error("Could not find EN desc end")
  const enBlock = enEntries
    .map((e) => {
      const escaped = e.text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")
      return `  "${e.slug}":\n    "${escaped}",`
    })
    .join("\n")
  // Better: use template with actual newlines in string via concatenation
  const enLines = enEntries
    .map((e) => {
      const lines = e.text.split("\n")
      if (lines.length === 1) {
        return `  "${e.slug}":\n    ${JSON.stringify(e.text)},`
      }
      return `  "${e.slug}":\n    ${JSON.stringify(e.text)},`
    })
    .join("\n")
  en = en.slice(0, insertAt) + "\n" + enLines + en.slice(insertAt)
  fs.writeFileSync(EN_DESC, en)
}

console.log(`\nAdded ${entries.length} motorcycles.`)
console.log(`EN descriptions: ${enEntries.map((e) => e.slug).join(", ") || "(none extra)"}`)
