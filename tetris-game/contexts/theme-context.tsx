"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "classic" | "dark" | "neon" | "retro"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Try to get saved theme from localStorage or default to "classic"
  const [theme, setTheme] = useState<Theme>("classic")

  useEffect(() => {
    const savedTheme = localStorage.getItem("tetris-theme") as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("tetris-theme", theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
