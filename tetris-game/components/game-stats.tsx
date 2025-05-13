interface GameStatsProps {
  score: number
  level: number
  linesCleared: number
}

export default function GameStats({ score, level, linesCleared }: GameStatsProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-700 w-full">
      <h2 className="text-xl font-bold text-white mb-2">Stats</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">Score:</span>
          <span className="text-white font-mono">{score}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Level:</span>
          <span className="text-white font-mono">{level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Lines:</span>
          <span className="text-white font-mono">{linesCleared}</span>
        </div>
      </div>
    </div>
  )
}
