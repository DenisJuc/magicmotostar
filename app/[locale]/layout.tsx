import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { LocaleLang } from "@/components/locale-lang"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const descriptions: Record<string, string> = {
    en: "Premium motorcycle dealership. Browse our curated selection. Trust your ride with Magic Moto.",
    ro: "Dealer motociclete premium. Vezi selecția noastră. Încrede-te în mers.",
    fr: "Concessionnaire de motos haut de gamme. Parcourez notre sélection. Trust your ride avec Magic Moto.",
  }
  return {
    title: "Magic Moto | Trust Your Ride",
    description: descriptions[locale] ?? descriptions.en,
    keywords: [
      "motorcycles",
      "motorcycle dealer",
      "used motorcycles",
      "Magic Moto",
    ],
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleLang />
      {children}
    </NextIntlClientProvider>
  )
}
