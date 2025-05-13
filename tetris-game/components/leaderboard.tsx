"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Trophy } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  score: number
  level: number
  lines: number
  created_at: string
}

interface LeaderboardProps {
  currentScore: number
  currentLevel: number
  currentLines: number
  gameOver: boolean
}

export default function Leaderboard({ currentScore, currentLevel, currentLines, gameOver }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [playerName, setPlayerName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Fetch leaderboard data
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use localStorage as a simple demo
        const savedLeaderboard = localStorage.getItem("tetris-leaderboard")
        if (savedLeaderboard) {
          setLeaderboard(JSON.parse(savedLeaderboard))
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Submit score to leaderboard
  const submitScore = async () => {
    if (!playerName.trim() || currentScore === 0 || submitted) return

    setSubmitting(true)

    try {
      // In a real implementation, this would submit to Supabase
      // For now, we'll use localStorage as a simple demo
      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        name: playerName,
        score: currentScore,
        level: currentLevel,
        lines: currentLines,
        created_at: new Date().toISOString(),
      }

      const newLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10)
      setLeaderboard(newLeaderboard)
      localStorage.setItem("tetris-leaderboard", JSON.stringify(newLeaderboard))
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting score:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Trophy className="h-4 w-4" />
          <span>Leaderboard</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogDescription>Top Tetris players</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-6 text-center">Loading leaderboard...</div>
        ) : (
          <div className="py-4">
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-4 font-medium text-sm">
                  <div>Rank</div>
                  <div>Player</div>
                  <div>Score</div>
                  <div>Level</div>
                </div>
                {leaderboard.map((entry, index) => (
                  <div key={entry.id} className="grid grid-cols-4 text-sm">
                    <div>{index + 1}</div>
                    <div>{entry.name}</div>
                    <div>{entry.score}</div>
                    <div>{entry.level}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-gray-500">No scores yet. Be the first to submit!</div>
            )}
          </div>
        )}

        {gameOver && currentScore > 0 && !submitted && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Submit Your Score</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                disabled={submitting}
              />
              <Button onClick={submitScore} disabled={!playerName.trim() || submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
