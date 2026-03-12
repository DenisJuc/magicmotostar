#!/usr/bin/env node
/**
 * Generate resized icon assets from public/logo_black.png using sharp.
 * Run: node scripts/generate-icons.mjs
 */

import sharp from "sharp"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const SRC = path.join(ROOT, "public", "logo_black.png")
const OUT = path.join(ROOT, "public")

const outputs = [
  { file: "favicon.ico", size: 32 },
  { file: "apple-icon.png", size: 180 },
  { file: "icon.png", size: 192 },
  { file: "icon-512x512.png", size: 512 },
]

async function main() {
  for (const { file, size } of outputs) {
    const outPath = path.join(OUT, file)
    await sharp(SRC)
      .resize(size, size)
      .png()
      .toFile(outPath)
    console.log(`Wrote ${file} (${size}x${size})`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
