import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🎮 Mini Games Hub - Classic Games Collection',
  description: 'Play classic mini games like Minesweeper, Tetris, Snake, Tic Tac Toe, Memory Card, Snake & Ladder, College Game, Flappy Bird, and Pong. All games are free to play and work on desktop and mobile.',
  keywords: 'mini games, browser games, tetris, minesweeper, snake, tic tac toe, memory card, flappy bird, pong, free games',
  authors: [{ name: 'Mini Games Hub' }],
  creator: 'Mini Games Hub',
  publisher: 'Mini Games Hub',
  robots: 'index, follow',
  openGraph: {
    title: '🎮 Mini Games Hub - Classic Games Collection',
    description: 'Play classic mini games like Minesweeper, Tetris, Snake, Tic Tac Toe, Memory Card, Snake & Ladder, College Game, Flappy Bird, and Pong.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Mini Games Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎮 Mini Games Hub - Classic Games Collection',
    description: 'Play classic mini games like Minesweeper, Tetris, Snake, Tic Tac Toe, Memory Card, Snake & Ladder, College Game, Flappy Bird, and Pong.',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#667eea',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mini Games Hub" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
