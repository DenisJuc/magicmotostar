"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  Send,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const contactInfoItems = [
  { icon: Phone, labelKey: "phone" as const, value: "+1 (514) 415-4612", href: "tel:+15144154612" },
  { icon: Mail, labelKey: "email" as const, value: "info@magicmotostar.ca", href: "mailto:info@magicmotostar.ca" },
  { icon: MapPin, labelKey: "address" as const, value: "Gherla, Romania", href: "https://maps.google.com" },
]

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61574938995012",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/magicmotogroup/",
    label: "Instagram",
  },
  {
    icon: TikTokIcon,
    href: "https://www.tiktok.com/@pauljucan?_r=1&_t=ZS-94aVXDomiyT",
    label: "TikTok",
  },
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.82 7.44a6.76 6.76 0 01-3.86-2.24A6.71 6.71 0 0115.4 1h-3.6v13.8a3.03 3.03 0 01-1.68 2.71 3.08 3.08 0 01-4.48-2.75 3.08 3.08 0 014.03-2.94V8.22a6.74 6.74 0 00-2.06-.32A6.77 6.77 0 001 14.65 6.77 6.77 0 007.61 21.4a6.77 6.77 0 006.79-6.6V8.85a10.2 10.2 0 006.42 2.26V7.44z" />
    </svg>
  )
}

export function ContactPage() {
  const t = useTranslations("contact")
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormState({ name: "", email: "", phone: "", message: "" })
    }, 3000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              {t("getInTouch")}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-4">
              {t("contactTitle")}
            </h1>
            <p className="text-muted-foreground">
              {t("contactSubtext")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left: Form + business info (spans 2 cols on desktop) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-card border border-border rounded-xl p-8">
                  <h2 className="text-2xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-6">
                    {t("sendMessage")}
                  </h2>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{t("messageSent")}</h3>
                      <p className="text-muted-foreground">{t("messageSentSubtext")}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("name")}</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            placeholder={t("yourName")}
                            required
                            className="bg-input border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("email")}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChange}
                            placeholder={t("yourEmail")}
                            required
                            className="bg-input border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("phone")}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder={t("yourPhone")}
                          className="bg-input border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t("message")}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          placeholder={t("messagePlaceholder")}
                          rows={5}
                          required
                          className="bg-input border-border resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            {t("sending")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            {t("sendMessageButton")}
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>

              {/* Business Info + WhatsApp row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-8"
              >
                {/* WhatsApp CTA */}
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">{t("chatWhatsApp")}</h3>
                      <p className="text-muted-foreground text-xs">{t("quickResponses")}</p>
                    </div>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
                  >
                    <a
                      href="https://wa.me/15144154612"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t("messageOnWhatsApp")}
                    </a>
                  </Button>
                </div>

                {/* Contact Details */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-base font-bold font-[family-name:var(--font-oswald)] uppercase mb-4">
                    {t("businessInfo")}
                  </h3>
                  <div className="space-y-3">
                    {contactInfoItems.map((item) => (
                      <div key={item.labelKey} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {t(item.labelKey)}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              target={
                                item.href.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                item.href.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="text-sm font-medium hover:text-primary transition-colors truncate block"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social row */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label={social.label}
                      >
                        <social.icon className="h-4 w-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Founder / Father photo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              {/* Portrait */}
              <div className="relative rounded-2xl overflow-hidden border border-border flex-1 min-h-[420px]">
                <Image
                  src="/images/dad.jpg"
                  alt={t("founderAlt")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-background/10" />
                {/* Name plate */}
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border px-5 py-4">
                  <p className="font-bold font-[family-name:var(--font-oswald)] uppercase text-base leading-tight">
                    {t("founderOwner")}
                  </p>
                  <p className="text-primary text-xs tracking-wider uppercase mt-0.5">
                    Magic Moto Star
                  </p>
                </div>
              </div>

              {/* Short blurb */}
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{t("founderQuote")}&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
