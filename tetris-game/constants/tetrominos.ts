import type { TetrominoType } from "@/types"

export const TETROMINOS = {
  0: { shape: [[0]], className: "" },
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    className: "tetromino-I",
  },
  J: {
    shape: [
      [0, 0, 0],
      [2, 2, 2],
      [0, 0, 2],
    ],
    className: "tetromino-J",
  },
  L: {
    shape: [
      [0, 0, 0],
      [3, 3, 3],
      [3, 0, 0],
    ],
    className: "tetromino-L",
  },
  O: {
    shape: [
      [4, 4],
      [4, 4],
    ],
    className: "tetromino-O",
  },
  S: {
    shape: [
      [0, 0, 0],
      [0, 5, 5],
      [5, 5, 0],
    ],
    className: "tetromino-S",
  },
  T: {
    shape: [
      [0, 0, 0],
      [6, 6, 6],
      [0, 6, 0],
    ],
    className: "tetromino-T",
  },
  Z: {
    shape: [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7],
    ],
    className: "tetromino-Z",
  },
}

export const TETROMINO_TYPES: TetrominoType[] = ["I", "J", "L", "O", "S", "T", "Z"]

export const randomTetromino = (): TetrominoType => {
  const tetrominos = TETROMINO_TYPES
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)]
  return randTetromino
}
