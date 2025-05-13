'use client';

import { TETROMINOS } from "@/constants/tetrominos"
import type { ActivePiece, BoardType } from "@/types"
import { useEffect, useState } from "react"

interface BoardProps {
  board: BoardType
  activePiece: ActivePiece | null
  ghostPiecePosition: { x: number; y: number } | null
}

export default function Board({ board, activePiece, ghostPiecePosition }: BoardProps) {
  // Add client-side only rendering to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Define the valid tetromino types to help TypeScript
  type TetrominoKey = keyof typeof TETROMINOS

  // Render the active piece on the board
  const renderActivePiece = () => {
    if (!activePiece) return null

    const { shape, position, type } = activePiece

    return shape.map((row, y) =>
      row.map((cell, x) => {
        if (cell !== 0) {
          const posY = y + position.y
          const posX = x + position.x

          // Only render if within board boundaries
          if (posY >= 0 && posY < 20 && posX >= 0 && posX < 10) {
            // Use the tetromino type from the activePiece
            const tetromino = TETROMINOS[type] || TETROMINOS["I"]
            return (
              <div
                key={`active-${posY}-${posX}`}
                className={`absolute rounded-sm border border-white/20 ${tetromino.className}`}
                style={{
                  top: `${posY * 1.5}rem`,
                  left: `${posX * 1.5}rem`,
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
            )
          }
          return null
        }
        return null
      }),
    )
  }

  // Also update the renderGhostPiece function with the same approach
  const renderGhostPiece = () => {
    if (!activePiece || !ghostPiecePosition) return null

    const { shape } = activePiece

    return shape.map((row, y) =>
      row.map((cell, x) => {
        if (cell !== 0) {
          const posY = y + ghostPiecePosition.y
          const posX = x + ghostPiecePosition.x

          // Only render if within board boundaries
          if (posY >= 0 && posY < 20 && posX >= 0 && posX < 10) {
            return (
              <div
                key={`ghost-${posY}-${posX}`}
                className="absolute rounded-sm border border-white/20 bg-white/20"
                style={{
                  top: `${posY * 1.5}rem`,
                  left: `${posX * 1.5}rem`,
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
            )
          }
          return null
        }
        return null
      }),
    )
  }

  // Helper function to get the appropriate Tetromino type from a cell value
  const getTetrominoType = (cellValue: number): TetrominoKey => {
    // Map cell values to tetromino types
    const typeMap: Record<number, TetrominoKey> = {
      1: 'I',
      2: 'J',
      3: 'L', 
      4: 'O',
      5: 'S',
      6: 'T',
      7: 'Z',
      0: 0  // Use numeric 0 instead of string "0"
    }
    
    return typeMap[cellValue] || 0 // Use 0 as the default
  }

  // If not client-side yet, render a simple placeholder to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="relative bg-gray-800 border-2 border-gray-700 rounded-md overflow-hidden">
        <div className="grid grid-cols-10 gap-0">
          {board.map((row, y) =>
            row.map((_, x) => (
              <div key={`${y}-${x}`} className="w-6 h-6 border border-gray-700/50 bg-gray-900/50" />
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-gray-800 border-2 border-gray-700 rounded-md overflow-hidden">
      {/* Ghost piece */}
      {renderGhostPiece()}

      {/* Active piece */}
      {renderActivePiece()}

      {/* Board cells */}
      <div className="grid grid-cols-10 gap-0">
        {board.map((row, y) =>
          row.map((cell, x) => {
            // Use the helper function to get the tetromino type
            const tetrominoType = getTetrominoType(cell)
            const cellClass = cell !== 0 ? TETROMINOS[tetrominoType].className : "bg-gray-900/50"

            return <div key={`${y}-${x}`} className={`w-6 h-6 border border-gray-700/50 ${cellClass}`} />
          }),
        )}
      </div>
    </div>
  )
}