"use client"

import { useLocale } from "next-intl"
import { useEffect } from "react"

export function LocaleLang() {
  const locale = useLocale()
  useEffect(() => {
    document.documentElement.lang = locale === "ro" ? "ro" : "en"
  }, [locale])
  return null
}
