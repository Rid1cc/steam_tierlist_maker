import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Steam Tierlist Maker',
  description: 'Create custom tier lists for your Steam games',
  keywords: ['steam', 'tierlist', 'games', 'ranking', 'tier maker', 'steam games'],
  authors: [{ name: 'Ridicc', url: 'https://github.com/Rid1cc' }],
  creator: 'Ridicc',
  publisher: 'Ridicc',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Steam Tierlist Maker',
    description: 'Create custom tier lists for your Steam games',
    type: 'website',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Steam Tierlist Maker',
    description: 'Create custom tier lists for your Steam games',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen steam-bg">
          {children}
        </div>
      </body>
    </html>
  )
}