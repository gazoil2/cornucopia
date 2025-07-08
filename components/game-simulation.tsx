"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { simulateNextPhase } from "../services/game-simulation"
import type { GameState, GameEvent } from "../types/game"
import ParticipantDisplay from "./participant-display"

interface GameSimulationProps {
  initialState: GameState
  onGameEnd?: (state: GameState) => void
}

const GameSimulation: React.FC<GameSimulationProps> = ({ initialState, onGameEnd }) => {
  const [gameState, setGameState] = useState<GameState>(initialState)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(2000)
  const eventsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let autoPlayTimer: NodeJS.Timeout

    if (isAutoPlaying && gameState.phase !== "victory") {
      autoPlayTimer = setTimeout(() => {
        handleNextPhase()
      }, autoPlaySpeed)
    }

    return () => {
      if (autoPlayTimer) {
        clearTimeout(autoPlayTimer)
      }
    }
  }, [isAutoPlaying, gameState, autoPlaySpeed])

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [gameState.events])

  const handleNextPhase = () => {
    const newState = simulateNextPhase(gameState)
    setGameState(newState)

    if (newState.phase === "victory" && onGameEnd) {
      onGameEnd(newState)
      setIsAutoPlaying(false)
    }
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const getPhaseTitle = () => {
    switch (gameState.phase) {
      case "bloodbath":
        return "CLICK START"
      case "day":
        if (gameState.day === 1) {
          return "The Bloodbath"
        }
        return `The fallen`
      case "night":
        return `Day ${gameState.day}`
      case "fallen":
        return `Night ${gameState.day}`
      case "victory":
        return "Victory"
      default:
        return "The Games"
    }
  }

  const getPhaseIcon = () => {
    switch (gameState.phase) {
      case "bloodbath":
        return "🗡️"
      case "day":
        if (gameState.day === 1) {
          return "🗡️"
        }
        return "🪦"
      case "night":
        return "☀️"
      case "fallen":
        return "🌙"
      case "victory":
        return "👑"
      default:
        return "🏹"
    }
  }

  const getPhaseGradient = () => {
    switch (gameState.phase) {
      case "bloodbath":
        return "from-red-500 to-red-700"
      case "day":
        if (gameState.day === 1) {
          return "from-red-500 to-red-700"
        }
        return "from-gray-500 to-gray-700"
      case "night":
        return "from-yellow-400 to-orange-500"
        
      case "fallen":
        return "from-blue-600 to-purple-700"
        
      case "victory":
        return "from-yellow-400 to-yellow-600"
      default:
        return "from-orange-500 to-red-600"
    }
  }

  const getRecentEvents = (): GameEvent[] => {
    console.log(gameState.phase)
    console.log(gameState.events)
    switch (gameState.phase) {
      case "day":
        // On day 1, show bloodbath events. On subsequent days, show the "fallen" summary from the previous night.
        if (gameState.day === 1) {
          return gameState.events.filter((event) => event.phase === "bloodbath")
        }
        // After day 1, the day starts after the "fallen" phase, which has a summary event.
        // The day has been incremented, so we look for the fallen event of the previous day.
        return gameState.events.filter(
          (event) => event.day === gameState.day - 1 && event.phase === "fallen",
        )
      case "night":
        // The night screen shows what happened during the day.
        return gameState.events.filter((event) => event.day === gameState.day && event.phase === "day")
      case "fallen":
        // The "Fallen" screen shows what happened during the night.
        return gameState.events.filter((event) => event.day === gameState.day && event.phase === "night")
      case "victory": {
        // On victory, find the last phase with events before victory was declared.
        const lastEvent = gameState.events[gameState.events.length - 1]
        if (!lastEvent) return []
        return gameState.events.filter(
          (event) => event.day === lastEvent.day && event.phase === lastEvent.phase,
        )
      }
      case "bloodbath":
        return gameState.events.filter((event) => event.phase === "bloodbath")
      default:
        // For the initial "bloodbath" phase.
        return gameState.events.filter((event) => event.phase === gameState.phase)
    }
  }

  const renderEventTag = (event: GameEvent): string | null => {
    switch (event.type) {
      case "item":
        return event.itemUsed ? `🎒 Received: ${event.itemUsed.name}` : null
      case "kill":
        return `⚔️ ${
          event.itemUsed
            ? `Weapon Used: ${event.itemUsed.name}`
            : event.description.includes("betrays")
            ? "Betrayal!"
            : "Attack"
        }`
      case "steal":
        return event.itemUsed ? `✋ Stole: ${event.itemUsed.name}` : null
      case "trap":
        if (event.itemUsed) {
          return event.participants.length > 1
            ? `💥 Triggered Trap: ${event.itemUsed.name}`
            : `🔧 Set Trap: ${event.itemUsed.name}`
        }
        return null
      case "alliance":
        return `🤝 Alliance Formed`
      case "survival":
        if (event.itemUsed) {
          return `💪 Practiced With: ${event.itemUsed.name}`
        }
        return null
      default:
        return null
    }
  }

  const glassmorphismStyle =
    "bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"

  return (
    <div className="max-w-8xl mx-auto p-4 flex flex-col items-center">
      <header
        className={`w-full max-w-5xl p-8 mb-10 text-center rounded-2xl shadow-2xl ${glassmorphismStyle} hover:shadow-3xl transition-all duration-500`}
      >
        <div className="relative">
          <h2
            className={`text-6xl md:text-7xl font-bold tracking-wider uppercase bg-gradient-to-r ${getPhaseGradient()} bg-clip-text text-transparent drop-shadow-2xl`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <span className="text-6xl mr-4 filter drop-shadow-lg">{getPhaseIcon()}</span>
            {getPhaseTitle()}
          </h2>
          <div
            className={`absolute -inset-6 bg-gradient-to-r ${getPhaseGradient()} opacity-20 blur-3xl -z-10 rounded-full`}
          ></div>
        </div>
        <div className={`w-32 h-1 bg-gradient-to-r ${getPhaseGradient()} mx-auto mt-4 rounded-full`}></div>
      </header>

      <div
        className={`w-full max-w-5xl flex items-center justify-center flex-wrap gap-6 p-6 mb-10 rounded-2xl ${glassmorphismStyle} hover:shadow-2xl transition-all duration-500`}
      >
        <button
          onClick={handleNextPhase}
          disabled={gameState.phase === "victory"}
          className="group px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none border border-orange-400/30"
        >
          <span className="group-hover:animate-pulse">⚡</span> Next Phase
        </button>

        <button
          onClick={toggleAutoPlay}
          disabled={gameState.phase === "victory"}
          className={`px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-2xl border ${
            isAutoPlaying
              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black border-yellow-400/30 hover:shadow-yellow-500/25"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-green-400/30 hover:shadow-green-500/25"
          } disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none`}
        >
          {isAutoPlaying ? "⏸️ Pause" : "▶️ Auto Play"}
        </button>

        {isAutoPlaying && (
          <div className={`flex items-center space-x-4 p-4 rounded-xl ${glassmorphismStyle} animate-fade-in`}>
            <label className="font-semibold text-sm text-yellow-300">⚡ Speed:</label>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={autoPlaySpeed}
              onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
              className="w-32 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-bold text-sm w-12 text-center text-yellow-300">{autoPlaySpeed / 1000}s</span>
          </div>
        )}
      </div>

      <div
        className={`w-full max-w-7xl min-h-220 p-8 mb-10 rounded-2xl shadow-2xl ${glassmorphismStyle} hover:shadow-3xl transition-all duration-500`}
      >
        <h3
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          📜 Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
          {getRecentEvents().map((event, index) => {
            const eventTag = renderEventTag(event)
            const actor = gameState.participants.find((p) => p.id === event.participants[0])

            return (
              <div
                key={event.id}
                className="group text-lg p-4 rounded-xl bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  {actor ? (
                    <img
                      src={actor.image || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${actor.name}`}
                      alt={actor.name}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-white/10 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-black/20 rounded-lg border-2 border-white/10">
                      <span className="text-2xl">📜</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="leading-relaxed group-hover:text-white text-black transition-colors duration-300 text-base">
                      {event.description}
                    </p>
                    {eventTag && (
                      <div className="mt-2 text-sm bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-semibold">
                        {eventTag}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {getRecentEvents().length === 0 && (
            <div className="text-gray-400 italic text-center py-8 text-xl md:col-span-2">
              <div className="text-4xl mb-4">🌙</div>
              The arena is quiet... for now.
            </div>
          )}
          <div ref={eventsEndRef} className="md:col-span-2" />
        </div>
      </div>

      <div className="w-full max-w-7xl">
        <h3
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          🏹 Tributes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {gameState.participants.map((participant, index) => (
            <div key={participant.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <ParticipantDisplay participant={participant} showDetails={true} />
            </div>
          ))}
        </div>
      </div>

      {gameState.phase === "victory" && gameState.winner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div
            className={`text-center p-12 rounded-3xl shadow-3xl ${glassmorphismStyle} border-4 border-yellow-400/50 max-w-2xl mx-4`}
          >
            <div className="text-9xl mb-6 animate-bounce">👑</div>
            <h2
              className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {gameState.winner.name}
            </h2>
            <h3 className="text-3xl font-bold mb-4 text-yellow-300">is Victorious!</h3>
            <p className="text-2xl text-gray-200 mb-8">
              With {gameState.winner.kills} kill{gameState.winner.kills !== 1 ? "s" : ""}.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8 rounded-full"></div>
            <button
              onClick={() => window.location.reload()}
              className="px-10 py-4 rounded-2xl font-bold text-xl uppercase tracking-wider bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
            >
              🎮 Play Again
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #dc2626);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #b91c1c);
        }
      `}</style>
    </div>
  )
}

export default GameSimulation