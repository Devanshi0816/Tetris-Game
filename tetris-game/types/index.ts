// In your @/types file:

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z' | '0'

export interface ActivePiece {
  shape: number[][]
  position: { x: number; y: number }
  type: TetrominoType  // Add this property if it's missing
}

export type BoardType = number[][]