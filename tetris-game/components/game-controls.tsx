"use client"

import { Button } from "@/components/ui/button"

interface GameControlsProps {
  gameStarted: boolean
  gameOver: boolean
  onStart: () => void
  onPause: () => void
  onSave?: () => void
  onLoad?: () => void
  hasSavedGame?: boolean
}

export default function GameControls({
  gameStarted,
  gameOver,
  onStart,
  onPause,
  onSave,
  onLoad,
  hasSavedGame = false,
}: GameControlsProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-700 w-full">
      <h2 className="text-xl font-bold text-white mb-4">Controls</h2>

      <div className="flex flex-col gap-2">
        {gameOver ? (
          <Button onClick={onStart} className="w-full">
            Game Over - Restart
          </Button>
        ) : gameStarted ? (
          <Button onClick={onPause} variant="outline" className="w-full">
            Pause
          </Button>
        ) : (
          <Button onClick={onStart} className="w-full">
            {gameOver ? "Restart" : "Start Game"}
          </Button>
        )}

        {onSave && (
          <Button onClick={onSave} variant="outline" className="w-full" disabled={!gameStarted || gameOver}>
            Save Game
          </Button>
        )}

        {onLoad && (
          <Button onClick={onLoad} variant="outline" className="w-full" disabled={gameStarted || !hasSavedGame}>
            Load Game
          </Button>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400 space-y-1">
        <p>← → : Move left/right</p>
        <p>↓ : Soft drop</p>
        <p>↑ : Rotate</p>
        <p>Space : Hard drop</p>
        <p>Shift/C : Hold piece</p>
        <p>P : Pause</p>
      </div>
    </div>
  )
}
