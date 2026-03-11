import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MotorcycleDetail } from "@/components/motorcycle-detail"
import { getMotorcycleBySlug, motorcycles } from "@/lib/motorcycles"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    motorcycles.map((m) => ({ locale, slug: m.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const bike = getMotorcycleBySlug(slug)
  if (!bike) return {}

  return {
    title: `${bike.year} ${bike.make} ${bike.model} | Magic Moto Star`,
    description: `View details, photos, and specs for the ${bike.year} ${bike.make} ${bike.model}.`,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const bike = getMotorcycleBySlug(slug)
  if (!bike) notFound()

  return (
    <>
      <Navbar />
      <MotorcycleDetail bike={bike} />
      <Footer />
    </>
  )
}
