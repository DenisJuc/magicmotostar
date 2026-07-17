"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { isAnnouncementActive } from "@/lib/announcement"

const LOCALE_STORAGE_KEY = "locale"

const navLinks = [
  { href: "/" as const, key: "home" as const },
  { href: "/motorcycles" as const, key: "motorcycles" as const },
  { href: "/about" as const, key: "about" as const },
  { href: "/contact" as const, key: "contact" as const },
] as const

function persistLocale(locale: string) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {}
}

export function Navbar() {
  const t = useTranslations("nav")
  const tAnnouncement = useTranslations("announcement")
  const locale = useLocale()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const showAnnouncement = isAnnouncementActive()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        {showAnnouncement && (
          <div className="bg-primary text-primary-foreground">
            <p className="container mx-auto px-4 lg:px-8 py-2 text-center text-xs sm:text-sm font-medium tracking-wide leading-snug">
              {tAnnouncement("text")}
            </p>
          </div>
        )}
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <Image
                  src="/logo_black.png"
                  alt="Magic Moto"
                  width={716}
                  height={716}
                  className="h-10 w-auto"
                  style={{ objectFit: "contain" }}
                  priority
                />
                <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-oswald)] uppercase">
                  Magic Moto
                </span>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.key} href={link.href} className="relative group">
                  <span
                    className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                      pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(link.key)}
                  </span>
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              ))}

              {/* Language toggle */}
              <div className="flex items-center gap-1 ml-2 border-l border-border pl-4">
                <Link
                  href={pathname}
                  locale="en"
                  onClick={() => persistLocale("en")}
                  className={`flex items-center justify-center w-9 h-9 rounded-md text-sm font-semibold transition-colors ${
                    locale === "en"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                  aria-label="English"
                  title="English"
                >
                  EN
                </Link>
                <Link
                  href={pathname}
                  locale="ro"
                  onClick={() => persistLocale("ro")}
                  className={`flex items-center justify-center w-9 h-9 rounded-md text-sm font-semibold transition-colors ${
                    locale === "ro"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                  aria-label="Română"
                  title="Română"
                >
                  RO
                </Link>
              </div>

              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/contact">{t("getInTouch")}</Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center gap-1">
                <Link
                  href={pathname}
                  locale="en"
                  onClick={() => persistLocale("en")}
                  className={`w-8 h-8 rounded text-xs font-semibold flex items-center justify-center ${
                    locale === "en" ? "bg-primary text-primary-foreground" : "bg-muted/50"
                  }`}
                >
                  EN
                </Link>
                <Link
                  href={pathname}
                  locale="ro"
                  onClick={() => persistLocale("ro")}
                  className={`w-8 h-8 rounded text-xs font-semibold flex items-center justify-center ${
                    locale === "ro" ? "bg-primary text-primary-foreground" : "bg-muted/50"
                  }`}
                >
                  RO
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={t("toggleMenu")}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-lg md:hidden ${
              showAnnouncement ? "pt-36" : "pt-24"
            }`}
          >
            <nav className="container mx-auto px-4">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-2xl font-bold uppercase tracking-wide font-[family-name:var(--font-oswald)] ${
                        pathname === link.href
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4"
                >
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/contact">{t("getInTouch")}</Link>
                  </Button>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
