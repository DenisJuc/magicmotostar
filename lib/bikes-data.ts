export interface Motorcycle {
  id: string
  make: string
  model: string
  year: number
  price: number
  km: number
  condition: "New" | "Used" | "Certified Pre-Owned"
  image: string
  featured?: boolean
  category: "Sport" | "Cruiser" | "Adventure" | "Touring" | "Naked"
  engineSize: 800 | 900 | 950 | 1300 | 1500 | 1700 | 1800 | 1900
  status: "In Stock" | "Out of Stock"
}

export const motorcycles: Motorcycle[] = [
  {
    id: "1",
    make: "Kawasaki",
    model: "Ninja ZX-6R",
    year: 2023,
    price: 12999,
    km: 2500,
    condition: "Certified Pre-Owned",
    image: "/images/bike-1.jpg",
    featured: true,
    category: "Sport",
    engineSize: 900,
    status: "In Stock",
  },
  {
    id: "2",
    make: "Honda",
    model: "CBR650R",
    year: 2024,
    price: 10499,
    km: 0,
    condition: "New",
    image: "/images/bike-2.jpg",
    featured: true,
    category: "Sport",
    engineSize: 800,
    status: "In Stock",
  },
  {
    id: "3",
    make: "Yamaha",
    model: "YZF-R1",
    year: 2022,
    price: 18999,
    km: 8500,
    condition: "Used",
    image: "/images/bike-3.jpg",
    featured: true,
    category: "Sport",
    engineSize: 1000,
    status: "In Stock",
  },
  {
    id: "4",
    make: "Harley-Davidson",
    model: "Street Glide",
    year: 2023,
    price: 28500,
    km: 3200,
    condition: "Certified Pre-Owned",
    image: "/images/bike-4.jpg",
    category: "Cruiser",
    engineSize: 1800,
    status: "In Stock",
  },
  {
    id: "5",
    make: "Ducati",
    model: "Panigale V4",
    year: 2024,
    price: 32999,
    km: 0,
    condition: "New",
    image: "/images/bike-5.jpg",
    category: "Sport",
    engineSize: 1300,
    status: "Out of Stock",
  },
  {
    id: "6",
    make: "BMW",
    model: "R 1250 GS",
    year: 2023,
    price: 21500,
    km: 12000,
    condition: "Used",
    image: "/images/bike-6.jpg",
    category: "Adventure",
    engineSize: 1300,
    status: "In Stock",
  },
  {
    id: "7",
    make: "Triumph",
    model: "Street Triple RS",
    year: 2023,
    price: 14299,
    km: 4500,
    condition: "Certified Pre-Owned",
    image: "/images/bike-1.jpg",
    category: "Naked",
    engineSize: 950,
    status: "In Stock",
  },
  {
    id: "8",
    make: "Suzuki",
    model: "GSX-R750",
    year: 2022,
    price: 11999,
    km: 9800,
    condition: "Used",
    image: "/images/bike-2.jpg",
    category: "Sport",
    engineSize: 800,
    status: "Out of Stock",
  },
  {
    id: "9",
    make: "Indian",
    model: "Scout Bobber",
    year: 2024,
    price: 15999,
    km: 0,
    condition: "New",
    image: "/images/bike-4.jpg",
    category: "Cruiser",
    engineSize: 1700,
    status: "In Stock",
  },
]

export const brands = [...new Set(motorcycles.map((bike) => bike.make))]
export const conditions = ["New", "Used", "Certified Pre-Owned"] as const
export const categories = ["Sport", "Cruiser", "Adventure", "Touring", "Naked"] as const
export const engineSizes = [800, 900, 950, 1300, 1500, 1700, 1800, 1900] as const
export const statuses = ["In Stock", "Out of Stock"] as const
