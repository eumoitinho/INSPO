import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/providers/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ninetwo - Dashboard de Marketing Digital",
  description:
    "Ninetwo é o dashboard completo para acompanhar métricas de Google Ads, Facebook Ads e Google Analytics em tempo real.",
  icons: {
    icon: '/fav.png',
    shortcut: '/fav.png',
    apple: '/fav.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
