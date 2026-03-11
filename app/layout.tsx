import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: '--font-oswald'
});

export const metadata: Metadata = {
  title: 'Magic Moto Star | Trust Your Ride',
  description: 'Premium motorcycle dealership in Canada. Browse our curated selection of quality motorcycles. Trust your ride with Magic Moto Star.',
  generator: 'v0.app',
  keywords: [
    'motorcycles',
    'motorcycle dealer',
    'used motorcycles',
    'Canada',
    'Magic Moto Star',
  ],
  icons: {
    icon: '/logo_black.png',
    apple: '/logo_black.png',
    shortcut: '/logo_black.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#171717',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
