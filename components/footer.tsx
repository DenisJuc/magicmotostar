"use client"

import { motion } from "framer-motion"
import { Facebook, Instagram } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link as I18nLink } from "@/i18n/navigation"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

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
  { icon: WhatsAppIcon, href: "https://wa.me/15144154612", label: "WhatsApp" },
]

export function Footer() {
  const t = useTranslations("footer")
  const tNav = useTranslations("nav")

  const footerLinks = [
    {
      title: t("navigation"),
      links: [
        { label: tNav("home"), href: "/" },
        { label: tNav("motorcycles"), href: "/motorcycles" },
        { label: tNav("about"), href: "/about" },
        { label: tNav("contact"), href: "/contact" },
      ],
    },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <I18nLink href="/" className="inline-flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Magic Moto Star" className="h-10 w-auto" />
              <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-oswald)] uppercase">
                Magic Moto Star
              </span>
            </I18nLink>
            <p className="text-sm text-muted-foreground italic">
              &ldquo;{t("tagline")}&rdquo;
            </p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <I18nLink
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </I18nLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Magic Moto Star. {t("rights")}
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="text-primary hover:text-primary/70 transition-colors p-2 -m-2"
                aria-label={social.label}
              >
                <social.icon className="h-6 w-6" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
