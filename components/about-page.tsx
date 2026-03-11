"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export function AboutPage() {
  const t = useTranslations("about")
  const stats = [
    { value: "100%", label: t("statsPassionDriven") },
    { value: "Family", label: t("statsFatherSon") },
    { value: "Romania", label: t("statsBasedGherla") },
    { value: "Trust", label: t("statsOurFoundation") },
  ]
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.png"
            alt={t("showroomAlt")}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              {t("ourStory")}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-6">
              {t("aboutTitle")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("aboutSubtext")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission — image left, text right */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border"
            >
              <Image
                src="/images/denis.jpg"
                alt={t("denisAlt")}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-background/20" />
            </motion.div>

            {/* Story text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
                {t("ourMission")}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-6">
                {t("builtForRiders1")}
                <br />
                <span className="text-primary">{t("builtForRiders2")}</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("missionDescription")}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-background border border-border rounded-xl p-4 text-center"
                  >
                    <p className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-oswald)] mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              {t("letsConnect")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-6">
              {t("readyToExperience")}
              <br />
              <span className="text-primary">{t("theDifference")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("ctaText")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8">
                <Link href="/contact">{t("contactUs")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#F5B800] text-foreground hover:bg-[#F5B800] hover:text-white hover:border-[#F5B800] text-lg px-8">
                <Link href="/motorcycles">{t("browseInventory")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
