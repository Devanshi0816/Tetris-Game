"use client"

import { useState, useEffect, useCallback } from "react"
import { useGameBoard } from "@/hooks/use-game-board"
import Board from "@/components/board"
import GameStats from "@/components/game-stats"
import GameControls from "@/components/game-controls"
import { useInterval } from "@/hooks/use-interval"
import { useTheme } from "@/contexts/theme-context"
import ThemeSelector from "@/components/theme-selector"
import MobileControls from "@/components/mobile-controls"
import Leaderboard from "@/components/leaderboard"

export default function Tetris() {
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [dropTime, setDropTime] = useState<number | null>(null)
  const [level, setLevel] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  const { theme } = useTheme()

  const {
    board,
    score,
    linesCleared,
    activePiece,
    nextPiece,
    heldPiece,
    holdPiece,
    canHold,
    resetGame,
    moveLeft,
    moveRight,
    rotate,
    moveDown,
    hardDrop,
    ghostPiecePosition,
    saveGameState,
    loadGameState,
  } = useGameBoard()

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize the game on component mount
  useEffect(() => {
    resetGame()
  }, [resetGame])

  // Calculate drop time based on level
  useEffect(() => {
    if (gameStarted && !gameOver) {
      setDropTime(1000 / level)
    } else {
      setDropTime(null)
    }
  }, [gameStarted, gameOver, level])

  // Increase level every 10 lines
  useEffect(() => {
    const newLevel = Math.floor(linesCleared / 10) + 1
    setLevel(newLevel)
  }, [linesCleared])

  // Auto drop the piece
  useInterval(() => {
    if (!gameOver) {
      moveDown()
    }
  }, dropTime)

  // Handle key presses
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameStarted || gameOver) return

      switch (event.code) {
        case "ArrowLeft":
          moveLeft()
          break
        case "ArrowRight":
          moveRight()
          break
        case "ArrowDown":
          moveDown()
          break
        case "ArrowUp":
          rotate()
          break
        case "Space":
          hardDrop()
          break
        case "ShiftLeft":
        case "ShiftRight":
        case "KeyC":
          holdPiece()
          break
        case "KeyP":
          setGameStarted((prev) => !prev)
          break
        default:
          break
      }
    },
    [gameStarted, gameOver, moveLeft, moveRight, moveDown, rotate, hardDrop, holdPiece],
  )

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  // Start a new game
  const startGame = () => {
    resetGame()
    setGameStarted(true)
    setGameOver(false)
    setLevel(1)
  }

  // Game over check
  useEffect(() => {
    if (board[0].some((cell) => cell !== 0)) {
      setGameOver(true)
      setGameStarted(false)
    }
  }, [board])

  // Check for saved game
  useEffect(() => {
    const savedState = localStorage.getItem("tetris-game-state")
    setHasSavedGame(!!savedState)
  }, [])

  // Save/Load Handlers
  const handleSave = () => {
    saveGameState()
    setHasSavedGame(true)
  }

  const handleLoad = () => {
    if (loadGameState()) {
      setGameStarted(true)
      setGameOver(false)
    }
  }

  return (
    <div className={`tetris-game theme-${theme} w-full max-w-6xl mx-auto px-4 py-5`}>
      <div className="flex flex-col md:flex-row items-start justify-center ">
        
        {/* Left: Game Stats */}
        <div className="w-full md:w-1/4 order-2 md:order-1">
          <div className="bg-gray-800 bg-opacity-70 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-gray-200">Game Stats</h2>
            <div className="bg-gray-900 bg-opacity-50 rounded p-3">
              <GameStats score={score} level={level} linesCleared={linesCleared} />
            </div>
          </div>
        </div>

        {/* Center: Game Board */}
        <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
          <Board 
            board={board} 
            activePiece={activePiece} 
            ghostPiecePosition={ghostPiecePosition} 
          />
        </div>

        {/* Right: Theme & Controls */}
        <div className="w-full md:w-1/4 order-3">
          <div className="bg-gray-800 bg-opacity-70 rounded-lg p-4 shadow-lg space-y-6">
            {/* Theme & Leaderboard */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-200">Theme & Leaderboard</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                <ThemeSelector />
                <Leaderboard 
                  currentScore={score} 
                  currentLevel={level} 
                  currentLines={linesCleared} 
                  gameOver={gameOver}
                />
              </div>
            </div>

            {/* Controls */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-200">Game Controls</h2>
              <div className="bg-gray-900 bg-opacity-50 rounded p-3">
                <GameControls
                  gameStarted={gameStarted}
                  gameOver={gameOver}
                  onStart={startGame}
                  onPause={() => setGameStarted(false)}
                  onSave={handleSave}
                  onLoad={handleLoad}
                  hasSavedGame={hasSavedGame}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      {gameStarted && !gameOver && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm pt-3 pb-6 shadow-lg z-50">
          <MobileControls
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
            onMoveDown={moveDown}
            onRotate={rotate}
            onHardDrop={hardDrop}
            onHold={holdPiece}
          />
        </div>
      )}
    </div>
  )
}
