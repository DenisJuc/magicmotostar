"use client"

import { useRef, useLayoutEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Gauge, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { Motorcycle } from "@/lib/motorcycles"

interface BikeCardProps {
  bike: Motorcycle
  index?: number
}

export function BikeCard({ bike, index = 0 }: BikeCardProps) {
  const t = useTranslations("motorcycles")
  const ref = useRef<HTMLDivElement>(null)
  const [showInstantly, setShowInstantly] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.bottom < 0) {
      setShowInstantly(true)
    }
  }, [])

  const conditionColors: Record<string, string> = {
    New: "bg-primary/20 text-primary border-primary/30",
    Used: "bg-secondary/20 text-secondary border-secondary/30",
    "Like New": "bg-primary/20 text-primary border-primary/30",
    "Certified Pre-Owned": "bg-primary/20 text-primary border-primary/30",
  }

  const cardContent = (
    <>
      <Link
        href={`/motorcycles/${bike.slug}`}
        className="block bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={bike.image}
            alt={`${bike.year} ${bike.make} ${bike.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {/* Condition Badge */}
          <Badge
            className={`absolute top-4 left-4 ${conditionColors[bike.condition]} border`}
          >
            {bike.condition}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-lg font-[family-name:var(--font-oswald)] uppercase tracking-wide mb-2">
            {bike.make} {bike.model}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{bike.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4" />
              <span>{bike.km.toLocaleString()} km</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary font-[family-name:var(--font-oswald)]">
                {bike.price ? `${bike.price.toLocaleString()} €` : "—"}
              </p>
            </div>
            <span className="inline-flex h-8 items-center justify-center rounded-md border border-primary/50 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground">
              {t("viewDetails")}
            </span>
          </div>
        </div>
      </Link>
    </>
  )

  if (showInstantly) {
    return (
      <div ref={ref} className="group">
        {cardContent}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.3, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      {cardContent}
    </motion.div>
  )
}
