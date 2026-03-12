#!/usr/bin/env node
/**
 * Import motorcycles from moto-data/moto-1..moto-22.
 * - Read ONLY info.txt in each folder (title, year, cc, km, price)
 * - Copy all JPG/PNG files to public/motorcycles/[slug]/ as 01.jpg, 02.jpg, ...
 * - Append new entries to lib/motorcycles.ts (does not modify existing entries)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MOTO_DATA = path.join(ROOT, "moto-data");
const PUBLIC_MOTO = path.join(ROOT, "public", "motorcycles");
const LIB_MOTORCYCLES = path.join(ROOT, "lib", "motorcycles.ts");

const KNOWN_MAKES = [
  "Honda", "Kawasaki", "Suzuki", "Yamaha", "Harley-Davidson", "Harley",
  "BMW", "Ducati", "Triumph", "KTM", "Royal Enfield", "Indian", "Moto Guzzi",
];

function slugify(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseInfoTxt(content) {
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const out = {};
  for (const line of lines) {
    const m = line.match(/^(title|year|cc|km|price)\s*[:=]\s*(.+)$/i);
    if (m) out[m[1].toLowerCase()] = m[2].trim();
  }
  const title = out.title;
  if (!title) return null;
  const year = parseInt(String(out.year || "").replace(/\D/g, ""), 10);
  const engineSizeCc = parseInt(String(out.cc || "").replace(/\D/g, ""), 10);
  const km = parseInt(String(out.km || "").replace(/\D/g, ""), 10);
  const price = parseInt(String(out.price || "").replace(/\D/g, ""), 10);
  return {
    title,
    year: isNaN(year) ? 0 : year,
    engineSizeCc: isNaN(engineSizeCc) ? 0 : engineSizeCc,
    km: isNaN(km) ? 0 : km,
    price: isNaN(price) ? 0 : price,
  };
}

function extractMakeModel(title) {
  const t = title.trim();
  const make = KNOWN_MAKES.find((m) => t.toLowerCase().startsWith(m.toLowerCase())) || t.split(/\s+/)[0] || "Other";
  const model = t.replace(new RegExp(`^${make}\\s*`, "i"), "").trim() || t;
  return { make, model };
}

function getExistingSlugs() {
  const content = fs.readFileSync(LIB_MOTORCYCLES, "utf8");
  const slugs = [];
  const re = /slug:\s*`([^`]+)`/g;
  let m;
  while ((m = re.exec(content)) !== null) slugs.push(m[1]);
  return slugs;
}

function ensureUniqueSlug(baseSlug, existingSlugs) {
  let slug = baseSlug;
  let n = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${++n}`;
  }
  return slug;
}

function formatEntry(entry) {
  const desc = (entry.description || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`");
  return `  {
    id: \`${entry.id}\`,
    slug: \`${entry.slug}\`,
    make: \`${entry.make}\`,
    model: \`${entry.model}\`,
    year: ${entry.year},
    price: ${entry.price},
    km: ${entry.km},
    engineSizeCc: ${entry.engineSizeCc},
    condition: \`${entry.condition}\`,
    status: \`${entry.status}\`,
    brand: \`${entry.brand}\`,
    description: \`${desc}\`,
    image: \`${entry.image}\`,
    galleryImages: [${entry.galleryImages.map((x) => `"${x}"`).join(",")}],
    engineSoundVideo: \`${entry.engineSoundVideo}\`,
  }`;
}

function processFolder(folderPath, existingSlugs) {
  const infoPath = path.join(folderPath, "info.txt");
  if (!fs.existsSync(infoPath)) return null;
  const content = fs.readFileSync(infoPath, "utf8");
  const data = parseInfoTxt(content);
  if (!data) return null;

  const baseSlug = slugify(data.title);
  const slug = ensureUniqueSlug(baseSlug, existingSlugs);
  existingSlugs.push(slug);

  const { make, model } = extractMakeModel(data.title);
  const outDir = path.join(PUBLIC_MOTO, slug);
  fs.mkdirSync(outDir, { recursive: true });

  const imageFiles = fs.readdirSync(folderPath)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => a.localeCompare(b));

  const galleryPaths = [];
  imageFiles.forEach((f, i) => {
    const ext = path.extname(f).toLowerCase();
    const destName = `${String(i + 1).padStart(2, "0")}${ext}`;
    const destPath = path.join(outDir, destName);
    fs.copyFileSync(path.join(folderPath, f), destPath);
    galleryPaths.push(`/motorcycles/${slug}/${destName}`);
  });

  const image = galleryPaths[0] || `/motorcycles/${slug}/01.jpg`;
  return {
    id: slug,
    slug,
    make,
    model,
    year: data.year,
    price: data.price,
    km: data.km,
    engineSizeCc: data.engineSizeCc,
    condition: "Like New",
    status: "In Stock",
    brand: make,
    description: "",
    image,
    galleryImages: galleryPaths.length ? galleryPaths : [image],
    engineSoundVideo: `/motorcycles/${slug}/engine.mp4`,
  };
}

function main() {
  if (!fs.existsSync(MOTO_DATA)) {
    console.error("moto-data folder not found at:", MOTO_DATA);
    console.error("Create it and add moto-1 through moto-22 with info.txt in each, then run again.");
    process.exit(1);
  }

  const existingSlugs = getExistingSlugs();
  const newEntries = [];

  for (let i = 1; i <= 22; i++) {
    const folderName = `moto-${i}`;
    const folderPath = path.join(MOTO_DATA, folderName);
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) continue;

    const entry = processFolder(folderPath, existingSlugs);
    if (entry) {
      newEntries.push(entry);
      console.log("Processed", folderName, "->", entry.slug);
    }
  }

  if (newEntries.length === 0) {
    console.log("No new motorcycles to add (need info.txt with title in each folder).");
    return;
  }

  let libContent = fs.readFileSync(LIB_MOTORCYCLES, "utf8");
  const insertBefore = "\n]";
  const block = "\n" + newEntries.map(formatEntry).join(",\n") + ",";
  if (!libContent.includes(insertBefore)) {
    console.error("Could not find insertion point in lib/motorcycles.ts");
    process.exit(1);
  }
  libContent = libContent.replace(insertBefore, block + "\n]");
  fs.writeFileSync(LIB_MOTORCYCLES, libContent, "utf8");
  console.log("Appended", newEntries.length, "new entries to lib/motorcycles.ts");
}

main();