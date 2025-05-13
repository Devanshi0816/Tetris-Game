import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TETRIS App',
  description: "A comprehensive productivity app built with Next.js featuring a to-do list and a fun Tetris mini-game for short breaks.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
