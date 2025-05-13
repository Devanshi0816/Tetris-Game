"use client"

import { useState, useCallback, useEffect } from "react"
import { TETROMINOS, randomTetromino } from "@/constants/tetrominos"
import type { ActivePiece, BoardType, TetrominoType } from "@/types"

// Create an empty board
const createEmptyBoard = (): BoardType => Array.from({ length: 20 }, () => Array(10).fill(0))

export function useGameBoard() {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard())
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null)
  const [nextPiece, setNextPiece] = useState<TetrominoType>(randomTetromino())
  const [heldPiece, setHeldPiece] = useState<TetrominoType | null>(null)
  const [canHold, setCanHold] = useState<boolean>(true)
  const [score, setScore] = useState<number>(0)
  const [linesCleared, setLinesCleared] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)

  // Reset the game
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setScore(0)
    setLinesCleared(0)
    setHeldPiece(null)
    setCanHold(true)
    setGameStarted(true)
    setGameOver(false)

    // Create a new active piece
    const newPiece = randomTetromino()
    setActivePiece({
      shape: TETROMINOS[newPiece].shape,
      position: { x: 3, y: 0 },
      type: newPiece,
    })

    // Generate the next piece
    setNextPiece(randomTetromino())
  }, [])

  // Check for collision
  const checkCollision = useCallback(
    (shape: number[][], position: { x: number; y: number }): boolean => {
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          // Check if the cell is part of the tetromino shape
          if (shape[y][x] !== 0) {
            const boardX = x + position.x
            const boardY = y + position.y

            // Check if outside the board boundaries or collides with a non-empty cell
            if (
              boardX < 0 ||
              boardX >= 10 || // Left and right boundaries
              boardY >= 20 || // Bottom boundary
              (boardY >= 0 && board[boardY][boardX] !== 0) // Collision with existing pieces
            ) {
              return true
            }
          }
        }
      }
      return false
    },
    [board],
  )

  // Rotate the active piece
  const rotate = useCallback(() => {
    if (!activePiece) return

    // Create a rotated shape
    const rotatedShape = activePiece.shape[0].map((_, index) => activePiece.shape.map((row) => row[index]).reverse())

    // Check if the rotation is valid
    if (!checkCollision(rotatedShape, activePiece.position)) {
      setActivePiece({
        ...activePiece,
        shape: rotatedShape,
      })
    } else {
      // Try wall kicks (move left or right to make rotation possible)
      const kicks = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 2, y: 0 },
        { x: -2, y: 0 },
      ]

      for (const kick of kicks) {
        const newPosition = {
          x: activePiece.position.x + kick.x,
          y: activePiece.position.y + kick.y,
        }

        if (!checkCollision(rotatedShape, newPosition)) {
          setActivePiece({
            ...activePiece,
            shape: rotatedShape,
            position: newPosition,
          })
          break
        }
      }
    }
  }, [activePiece, checkCollision])

  // Move the active piece left
  const moveLeft = useCallback(() => {
    if (!activePiece) return

    const newPosition = {
      ...activePiece.position,
      x: activePiece.position.x - 1,
    }

    if (!checkCollision(activePiece.shape, newPosition)) {
      setActivePiece({
        ...activePiece,
        position: newPosition,
      })
    }
  }, [activePiece, checkCollision])

  // Move the active piece right
  const moveRight = useCallback(() => {
    if (!activePiece) return

    const newPosition = {
      ...activePiece.position,
      x: activePiece.position.x + 1,
    }

    if (!checkCollision(activePiece.shape, newPosition)) {
      setActivePiece({
        ...activePiece,
        position: newPosition,
      })
    }
  }, [activePiece, checkCollision])

  // Move the active piece down
  const moveDown = useCallback(() => {
    if (!activePiece) return

    const newPosition = {
      ...activePiece.position,
      y: activePiece.position.y + 1,
    }

    if (!checkCollision(activePiece.shape, newPosition)) {
      setActivePiece({
        ...activePiece,
        position: newPosition,
      })
    } else {
      // Piece has landed, merge it with the board
      const newBoard = [...board]

      // Add the piece to the board
      activePiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = y + activePiece.position.y
            const boardX = x + activePiece.position.x

            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              // Use the tetromino type as the cell value
              // Make sure we're using a valid tetromino type
              const typeValue = TETROMINO_TYPES.indexOf(activePiece.type) + 1
              // Ensure the value is between 1-7 (valid tetromino types)
              newBoard[boardY][boardX] = typeValue >= 1 && typeValue <= 7 ? typeValue : 1
            }
          }
        })
      })

      // Check for completed lines
      let linesCompleted = 0
      const updatedBoard = newBoard.filter((row) => {
        const isComplete = row.every((cell) => cell !== 0)
        if (isComplete) linesCompleted++
        return !isComplete
      })

      // Add empty lines at the top
      while (updatedBoard.length < 20) {
        updatedBoard.unshift(Array(10).fill(0))
      }

      // Update score
      if (linesCompleted > 0) {
        // Scoring system: 100 * level * (lines^2)
        const level = Math.floor(linesCleared / 10) + 1
        const linePoints = [0, 100, 300, 500, 800] // Points for 0, 1, 2, 3, 4 lines
        const points = linePoints[linesCompleted] * level

        setScore((prev) => prev + points)
        setLinesCleared((prev) => prev + linesCompleted)
      }

      // Update the board
      setBoard(updatedBoard)

      // Reset for the next piece
      setActivePiece({
        shape: TETROMINOS[nextPiece].shape,
        position: { x: 3, y: 0 },
        type: nextPiece,
      })

      // Generate a new next piece
      setNextPiece(randomTetromino())

      // Allow holding again
      setCanHold(true)
    }
  }, [activePiece, board, checkCollision, linesCleared, nextPiece])

  // Hard drop the active piece
  const hardDrop = useCallback(() => {
    if (!activePiece) return

    let dropDistance = 0
    const newPosition = { ...activePiece.position }

    // Find the maximum drop distance
    while (!checkCollision(activePiece.shape, { ...newPosition, y: newPosition.y + 1 })) {
      newPosition.y += 1
      dropDistance += 1
    }

    // Update score (2 points per cell dropped)
    setScore((prev) => prev + dropDistance * 2)

    // Set the new position and trigger the landing logic
    setActivePiece({
      ...activePiece,
      position: newPosition,
    })

    // Force the piece to land
    setTimeout(moveDown, 0)
  }, [activePiece, checkCollision, moveDown])

  // Hold the current piece
  const holdPiece = useCallback(() => {
    if (!activePiece || !canHold) return

    // Store the current piece
    const currentType = activePiece.type

    // If there's a held piece, swap them
    if (heldPiece) {
      setActivePiece({
        shape: TETROMINOS[heldPiece].shape,
        position: { x: 3, y: 0 },
        type: heldPiece,
      })
    } else {
      // Otherwise, use the next piece
      setActivePiece({
        shape: TETROMINOS[nextPiece].shape,
        position: { x: 3, y: 0 },
        type: nextPiece,
      })

      // Generate a new next piece
      setNextPiece(randomTetromino())
    }

    // Update the held piece
    setHeldPiece(currentType)

    // Prevent holding again until a piece is placed
    setCanHold(false)
  }, [activePiece, canHold, heldPiece, nextPiece])

  // Calculate ghost piece position
  const ghostPiecePosition = useCallback(() => {
    if (!activePiece) return null

    const ghostPosition = { ...activePiece.position }

    // Find the lowest valid position
    while (!checkCollision(activePiece.shape, { ...ghostPosition, y: ghostPosition.y + 1 })) {
      ghostPosition.y += 1
    }

    return ghostPosition
  }, [activePiece, checkCollision])

  // Add a function to save game state
  const saveGameState = useCallback(() => {
    if (!activePiece) return

    const gameState = {
      board,
      score,
      linesCleared,
      nextPiece,
      heldPiece,
      canHold,
      level: Math.floor(linesCleared / 10) + 1,
    }

    localStorage.setItem("tetris-game-state", JSON.stringify(gameState))
  }, [board, score, linesCleared, nextPiece, heldPiece, canHold, activePiece])

  // Add a function to load game state
  const loadGameState = useCallback(() => {
    const savedState = localStorage.getItem("tetris-game-state")
    if (!savedState) return false

    try {
      const gameState = JSON.parse(savedState)
      setBoard(gameState.board)
      setScore(gameState.score)
      setLinesCleared(gameState.linesCleared)
      setNextPiece(gameState.nextPiece)
      setHeldPiece(gameState.heldPiece)
      setCanHold(gameState.canHold)

      // Create a new active piece
      const newPiece = randomTetromino()
      setActivePiece({
        shape: TETROMINOS[newPiece].shape,
        position: { x: 3, y: 0 },
        type: newPiece,
      })

      return true
    } catch (error) {
      console.error("Failed to load game state:", error)
      return false
    }
  }, [])

  // Save game state when it changes
  useEffect(() => {
    if (gameStarted && !gameOver && activePiece) {
      saveGameState()
    }
  }, [board, score, linesCleared, gameStarted, gameOver, saveGameState, activePiece])

  // Initialize the game if there's no active piece
  if (!activePiece) {
    resetGame()
  }

  // Add these functions to the return object
  return {
    board,
    score,
    linesCleared,
    activePiece,
    nextPiece,
    heldPiece,
    canHold,
    resetGame,
    moveLeft,
    moveRight,
    rotate,
    moveDown,
    hardDrop,
    holdPiece,
    ghostPiecePosition: ghostPiecePosition(),
    saveGameState,
    loadGameState,
  }
}

// Helper for type safety
const TETROMINO_TYPES: TetrominoType[] = ["I", "J", "L", "O", "S", "T", "Z"]
