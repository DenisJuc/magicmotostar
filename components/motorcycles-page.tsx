"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useTranslations } from "next-intl"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BikeCard } from "@/components/bike-card"
import {
  motorcycles,
  brands,
  conditions,
  engineSizes,
  statuses,
  years,
  priceRangeValues,
  kmRangeValues,
} from "@/lib/motorcycles"

interface Filters {
  priceRange: string
  kmRange: string
  yearRange: string
  brand: string
  condition: string
  engineSize: string
  status: string
}

const defaultFilters: Filters = {
  priceRange: "all",
  kmRange: "all",
  yearRange: "all",
  brand: "all",
  condition: "all",
  engineSize: "all",
  status: "In Stock",
}

const PRICE_RANGE_LABEL_KEYS: Record<string, string> = {
  "0-6000": "under6k",
  "6000-8000": "price6to8",
  "8000-10000": "price8to10",
  "10000+": "price10plus",
}
const KM_RANGE_LABEL_KEYS: Record<string, string> = {
  "0-20000": "under20kKm",
  "20000-35000": "km20to35",
  "35000-50000": "km35to50",
  "50000+": "km50plus",
}

function filterOptionArrays(t: (k: string) => string) {
  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }))
  return {
    priceRanges: [
      { value: "all", label: t("allPrices") },
      ...priceRangeValues.map((v) => ({ value: v, label: t(PRICE_RANGE_LABEL_KEYS[v] ?? v) })),
    ],
    kmRanges: [
      { value: "all", label: t("allMileage") },
      ...kmRangeValues.map((v) => ({ value: v, label: t(KM_RANGE_LABEL_KEYS[v] ?? v) })),
    ],
    yearRanges: [
      { value: "all", label: t("allYears") },
      ...yearOptions,
      { value: "older", label: t("older") },
    ],
    engineSizeOptions: [{ value: "all", label: t("allSizes") }, ...engineSizes.map((cc) => ({ value: String(cc), label: `${cc}cc` }))],
    statusOptions: [{ value: "all", label: t("allStatus") }, ...statuses.map((s) => ({ value: s, label: s }))],
    brandOptions: [{ value: "all", label: t("allBrands") }, ...brands.map((b) => ({ value: b, label: b }))],
    conditionOptions: [{ value: "all", label: t("allConditions") }, ...conditions.map((c) => ({ value: c, label: c }))],
  }
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-input border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function FilterBar({
  filters,
  setFilters,
  activeFiltersCount,
  onClearFilters,
  options,
  labels,
}: {
  filters: Filters
  setFilters: (filters: Filters) => void
  activeFiltersCount: number
  onClearFilters: () => void
  options: ReturnType<typeof filterOptionArrays>
  labels: { filters: string; clearAll: string; price: string; mileage: string; year: string; brand: string; condition: string; engineSize: string; status: string }
}) {
  return (
    <div className="hidden lg:block bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <span className="font-medium">{labels.filters}</span>
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-foreground">
            {labels.clearAll} ({activeFiltersCount})
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <FilterSelect label={labels.price} value={filters.priceRange} onValueChange={(v) => setFilters({ ...filters, priceRange: v })} options={options.priceRanges} />
        <FilterSelect label={labels.mileage} value={filters.kmRange} onValueChange={(v) => setFilters({ ...filters, kmRange: v })} options={options.kmRanges} />
        <FilterSelect label={labels.year} value={filters.yearRange} onValueChange={(v) => setFilters({ ...filters, yearRange: v })} options={options.yearRanges} />
        <FilterSelect label={labels.brand} value={filters.brand} onValueChange={(v) => setFilters({ ...filters, brand: v })} options={options.brandOptions} />
        <FilterSelect label={labels.condition} value={filters.condition} onValueChange={(v) => setFilters({ ...filters, condition: v })} options={options.conditionOptions} />
        <FilterSelect label={labels.engineSize} value={filters.engineSize} onValueChange={(v) => setFilters({ ...filters, engineSize: v })} options={options.engineSizeOptions} />
        <FilterSelect label={labels.status} value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })} options={options.statusOptions} />
      </div>
    </div>
  )
}

function MobileFilterDrawer({
  filters,
  setFilters,
  activeFiltersCount,
  onClearFilters,
  options,
  labels,
  showResults,
}: {
  filters: Filters
  setFilters: (filters: Filters) => void
  activeFiltersCount: number
  onClearFilters: () => void
  options: ReturnType<typeof filterOptionArrays>
  labels: { filters: string; clearAll: string; price: string; mileage: string; year: string; brand: string; condition: string; engineSize: string; status: string; active: string }
  showResults: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden w-full mb-6 border-border">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {labels.filters}
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] bg-card border-border p-0 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
          <SheetHeader className="p-0">
            <SheetTitle className="text-foreground text-lg">{labels.filters}</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-foreground">
                {labels.clearAll} ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <FilterSelect label={labels.price} value={filters.priceRange} onValueChange={(v) => setFilters({ ...filters, priceRange: v })} options={options.priceRanges} />
          <FilterSelect label={labels.mileage} value={filters.kmRange} onValueChange={(v) => setFilters({ ...filters, kmRange: v })} options={options.kmRanges} />
          <FilterSelect label={labels.year} value={filters.yearRange} onValueChange={(v) => setFilters({ ...filters, yearRange: v })} options={options.yearRanges} />
          <FilterSelect label={labels.brand} value={filters.brand} onValueChange={(v) => setFilters({ ...filters, brand: v })} options={options.brandOptions} />
          <FilterSelect label={labels.condition} value={filters.condition} onValueChange={(v) => setFilters({ ...filters, condition: v })} options={options.conditionOptions} />
          <FilterSelect label={labels.engineSize} value={filters.engineSize} onValueChange={(v) => setFilters({ ...filters, engineSize: v })} options={options.engineSizeOptions} />
          <FilterSelect label={labels.status} value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })} options={options.statusOptions} />
        </div>
        <div className="px-4 py-4 border-t border-border shrink-0">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" onClick={() => setOpen(false)}>
            {showResults}
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-primary-foreground/20 text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount} {labels.active}
              </span>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function MotorcyclesPage() {
  const t = useTranslations("motorcycles")
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const options = useMemo(() => filterOptionArrays(t), [t])
  const labels = useMemo(
    () => ({
      filters: t("filters"),
      clearAll: t("clearAll"),
      price: t("price"),
      mileage: t("mileage"),
      year: t("year"),
      brand: t("brand"),
      condition: t("condition"),
      engineSize: t("engineSize"),
      status: t("status"),
      active: t("active"),
    }),
    [t]
  )

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "status") return value !== "all" && value !== defaultFilters.status
      return value !== "all"
    }).length
  }, [filters])

  const filteredBikes = useMemo(() => {
    return motorcycles.filter((bike) => {
      // Price filter (€)
      if (filters.priceRange !== "all") {
        if (filters.priceRange === "10000+") {
          if (bike.price < 10000) return false
        } else {
          const [min, max] = filters.priceRange.split("-").map(Number)
          if (bike.price < min || bike.price >= max) return false
        }
      }

      // KM filter
      if (filters.kmRange !== "all") {
        if (filters.kmRange === "50000+") {
          if (bike.km < 50000) return false
        } else {
          const [min, max] = filters.kmRange.split("-").map(Number)
          if (bike.km < min || bike.km >= max) return false
        }
      }

      // Year filter (dynamic years from inventory; "older" = 2007 and below)
      if (filters.yearRange !== "all") {
        if (filters.yearRange === "older") {
          if (bike.year > 2007) return false
        } else {
          if (bike.year.toString() !== filters.yearRange) return false
        }
      }

      // Brand filter
      if (filters.brand !== "all" && bike.make !== filters.brand) {
        return false
      }

      // Condition filter
      if (filters.condition !== "all" && bike.condition !== filters.condition) {
        return false
      }

      // Engine size filter
      if (
        filters.engineSize !== "all" &&
        bike.engineSizeCc !== Number(filters.engineSize)
      ) {
        return false
      }

      // Status filter
      if (filters.status !== "all" && bike.status !== filters.status) {
        return false
      }

      return true
    })
  }, [filters])

  const clearFilters = () => setFilters(defaultFilters)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">
              {t("ourInventory")}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-oswald)] uppercase mb-4">
              {t("title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {t("browseSubtext")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Inventory */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Mobile Filter Button */}
          <MobileFilterDrawer
            filters={filters}
            setFilters={setFilters}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearFilters}
            options={options}
            labels={labels}
            showResults={t("showResults")}
          />

          <FilterBar
            filters={filters}
            setFilters={setFilters}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearFilters}
            options={options}
            labels={labels}
          />

          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              {t("showing")}{" "}
              <span className="text-foreground font-medium">{filteredBikes.length}</span>{" "}
              {filteredBikes.length === 1 ? t("motorcycle") : t("motorcyclesCount")}
            </p>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filteredBikes.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredBikes.map((bike, index) => (
                  <BikeCard key={bike.id} bike={bike} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <X className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t("noBikesFound")}</h3>
                <p className="text-muted-foreground mb-6">{t("tryAdjusting")}</p>
                <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t("clearFilters")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  )
}
