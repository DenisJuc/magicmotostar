"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, MessageCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { Motorcycle } from "@/lib/motorcycles"
import { getRelatedMotorcycles } from "@/lib/motorcycles"
import { motorcycleDescriptionEn } from "@/lib/motorcycle-descriptions-en"
import { BikeCard } from "@/components/bike-card"

function cleanDescription(raw: string) {
  return raw
    .replace(/\[video[\s\S]*?\[\/video\]/gi, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !/^KM\s*:/i.test(l) &&
        !/^Info\s*:/i.test(l) &&
        !/^WhatsApp\s*:/i.test(l)
    )
    .join("\n\n")
    .trim()
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="py-3 pr-6 text-sm text-muted-foreground whitespace-nowrap">
        {label}
      </td>
      <td className="py-3 text-sm font-medium text-foreground">{value}</td>
    </tr>
  )
}

export function MotorcycleDetail({ bike }: { bike: Motorcycle }) {
  const locale = useLocale()
  const t = useTranslations("detail")
  const tStats = useTranslations("detailStats")
  const [activeImage, setActiveImage] = useState(bike.galleryImages[0] ?? bike.image)

  const related = useMemo(
    () => getRelatedMotorcycles(bike.brand, bike.slug, 3),
    [bike.brand, bike.slug]
  )

  const description = useMemo(() => {
    if (locale === "ro") return cleanDescription(bike.description)
    const enText = motorcycleDescriptionEn[bike.slug]
    return enText ?? cleanDescription(bike.description)
  }, [locale, bike.slug, bike.description])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 pt-36 pb-16">
        <div className="mb-8">
            <Button asChild variant="ghost" className="-ml-3 text-muted-foreground hover:text-foreground">
            <Link href="/motorcycles" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("backToMotorcycles")}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card">
              <Image
                src={activeImage}
                alt={`${bike.year} ${bike.make} ${bike.model}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>

            {bike.galleryImages.length > 1 && (
              <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
                {bike.galleryImages.map((src) => {
                  const isActive = src === activeImage
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(src)}
                      className={`relative aspect-square rounded-lg overflow-hidden border transition-colors ${
                        isActive ? "border-primary" : "border-border hover:border-primary/60"
                      }`}
                      aria-label="Select image"
                    >
                      <Image src={src} alt="" fill className="object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-primary uppercase tracking-[0.3em] text-xs font-medium mb-3">
                {bike.make}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-oswald)] uppercase leading-tight">
                {bike.model}
              </h1>

              <div className="mt-5 flex items-end gap-4 flex-wrap">
                <p className="text-4xl font-bold text-primary font-[family-name:var(--font-oswald)]">
                  {bike.price ? `${bike.price.toLocaleString()} €` : t("priceOnRequest")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {bike.km.toLocaleString()} km • {bike.year}
                </p>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-7">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <a
                    href="https://wa.me/15144154612"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t("askOnWhatsApp")}
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-10 bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="font-bold font-[family-name:var(--font-oswald)] uppercase tracking-wide">
                    {t("specs")}
                  </h2>
                </div>
                <div className="px-6 py-2">
                  <table className="w-full">
                    <tbody>
                      <StatRow label={tStats("price")} value={bike.price ? `${bike.price.toLocaleString()} €` : "—"} />
                      <StatRow label={tStats("km")} value={`${bike.km.toLocaleString()} km`} />
                      <StatRow label={tStats("year")} value={bike.year || "—"} />
                      <StatRow label={tStats("engineSize")} value={bike.engineSizeCc ? `${bike.engineSizeCc}cc` : "—"} />
                      <StatRow label={tStats("condition")} value={bike.condition || "—"} />
                      <StatRow label={tStats("status")} value={bike.status || "—"} />
                      <StatRow label={tStats("brand")} value={bike.brand || bike.make} />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Video */}
              <div className="mt-10 bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-4">
                  <h2 className="font-bold font-[family-name:var(--font-oswald)] uppercase tracking-wide">
                    {t("engineSound")}
                  </h2>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    {t("video")}
                  </div>
                </div>
                <div className="p-6">
                  <video
                    controls
                    preload="metadata"
                    className="w-full rounded-xl border border-border bg-background"
                    src={bike.engineSoundVideo}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-10 bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="font-bold font-[family-name:var(--font-oswald)] uppercase tracking-wide">
                    {t("description")}
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {description || "—"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-primary uppercase tracking-[0.3em] text-xs font-medium mb-2">
                  {t("moreFrom", { brand: bike.brand })}
                </p>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-oswald)] uppercase">
                  {t("relatedTitle")}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((m, index) => (
                <BikeCard key={m.slug} bike={m} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

