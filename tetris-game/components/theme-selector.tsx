"use client"

import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Paintbrush } from "lucide-react"

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: "Classic", value: "classic" },
    { name: "Dark", value: "dark" },
    { name: "Neon", value: "neon" },
    { name: "Retro", value: "retro" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Paintbrush className="h-4 w-4" />
          <span>Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value as any)}
            className={theme === t.value ? "bg-accent" : ""}
          >
            {t.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
