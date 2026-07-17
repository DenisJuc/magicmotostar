"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, Award, Wrench, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BikeCard } from "@/components/bike-card"
import { motorcycles } from "@/lib/motorcycles"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

const HERO_IMAGES = [
  "/images/hero-1.jpeg",
  "/images/hero-2.jpeg",
  "/images/hero-3.jpeg",
  "/images/hero-4.jpeg",
  "/images/hero-5.jpeg",
]
const HERO_INTERVAL_MS = 4000

export function Homepage() {
  const t = useTranslations("home")
  const featuredBikes = motorcycles.filter((m) => m.status === "In Stock").slice(0, 3)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, HERO_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const features = [
    { icon: Shield, titleKey: "feature1Title" as const, descKey: "feature1Desc" as const },
    { icon: Award, titleKey: "feature2Title" as const, descKey: "feature2Desc" as const },
    { icon: Wrench, titleKey: "feature3Title" as const, descKey: "feature3Desc" as const },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Carousel */}
      <section className="relative h-screen min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Carousel - stacked crossfade */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === heroIndex ? 1 : 0 }}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4"
            >
              {t("welcome")}
            </motion.p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-oswald)] uppercase leading-tight mb-6">
              <span className="text-foreground">{t("trustYourRide").split(" ")[0]}</span>
              <br />
              <span className="text-primary">{t("trustYourRide").split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md leading-relaxed">
              {t("heroSubtext")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8"
              >
                <Link href="/motorcycles">{t("browseMotorcycles")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#F5B800] text-foreground hover:bg-[#F5B800] hover:text-white hover:border-[#F5B800] text-lg px-8"
              >
                <Link href="/contact">{t("contactUs")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Gold dot indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setHeroIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === heroIndex ? "w-8 bg-[#F5B800]" : "w-2 bg-[#F5B800]/50 hover:bg-[#F5B800]/70"
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest">{t("scroll")}</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Bikes Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              {t("ourSelection")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-4">
              {t("featuredMotorcycles")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("featuredSubtext")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBikes.map((bike, index) => (
              <BikeCard key={bike.id} bike={bike} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#F5B800] text-foreground hover:bg-[#F5B800] hover:text-white hover:border-[#F5B800]"
            >
              <Link href="/motorcycles">{t("viewAllMotorcycles")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              {t("theMagicDifference")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-4">
              {t("whyChooseUs")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("whyChooseSubtext")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-6">
              {t("readyToFind")}{" "}
              <span className="text-primary">{t("perfectRide")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("ctaSubtext")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10"
            >
              <Link href="/motorcycles">{t("getStarted")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
