import { TETROMINOS } from "@/constants/tetrominos"
import type { TetrominoType } from "@/types"

interface NextPiecePreviewProps {
  piece: TetrominoType
}

export default function NextPiecePreview({ piece }: NextPiecePreviewProps) {
  const shape = TETROMINOS[piece].shape

  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-2">Next</h2>
      <div className="flex justify-center items-center h-20 w-20">
        <div className="relative">
          {shape.map((row, y) =>
            row.map((cell, x) => {
              if (cell !== 0) {
                return (
                  <div
                    key={`next-${y}-${x}`}
                    className={`absolute rounded-sm border border-white/20 ${TETROMINOS[piece].className}`}
                    style={{
                      top: `${y * 1.25}rem`,
                      left: `${x * 1.25}rem`,
                      width: "1.25rem",
                      height: "1.25rem",
                    }}
                  />
                )
              }
              return null
            }),
          )}
        </div>
      </div>
    </div>
  )
}
