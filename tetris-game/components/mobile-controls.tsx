"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCw, Square } from "lucide-react"

interface MobileControlsProps {
  onMoveLeft: () => void
  onMoveRight: () => void
  onMoveDown: () => void
  onRotate: () => void
  onHardDrop: () => void
  onHold: () => void
}

export default function MobileControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onHold,
}: MobileControlsProps) {
  return (
    <div className="md:hidden w-full mt-6">
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="icon" className="h-12 w-full" onTouchStart={onMoveLeft}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-full" onTouchStart={onMoveDown}>
          <ArrowDown className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-full" onTouchStart={onMoveRight}>
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <Button variant="outline" size="icon" className="h-12 w-full" onTouchStart={onRotate}>
          <RotateCw className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-full" onTouchStart={onHardDrop}>
          <ArrowUp className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-full" onTouchStart={onHold}>
          <Square className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
