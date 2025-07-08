"use client"

import type React from "react"
import { useState } from "react"
import ParticipantSetup from "./components/participant-setup"
import QuickSetup from "./components/quick-setup"
import GameSimulation from "./components/game-simulation"
import type { GameState, Participant } from "./types/game"
import { initializeGame } from "./services/game-simulation"
import ParticlesBackground from "./components/particles-background"

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [setupMode, setSetupMode] = useState<"quick" | "custom" | null>(null)

  const handleParticipantSetupComplete = (participants: Participant[]) => {
    setGameState(initializeGame(participants))
  }

  const handleGameEnd = (finalState: GameState) => {
    console.log("Game ended with winner:", finalState.winner?.name)
  }

  const renderSetupScreen = () => {
    if (!setupMode) {
      return (
        <div className="relative z-10 max-w-6xl mx-auto p-8 text-center text-white">
          <header className="mb-16 animate-fade-in">
            <div className="relative">
              <h1
                className="text-7xl md:text-8xl font-bold tracking-wider uppercase bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Hunger Games
              </h1>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-wider uppercase mt-2 text-white drop-shadow-lg"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Simulator
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl -z-10 rounded-full"></div>
            </div>
            <p className="text-xl text-gray-300 mt-6 font-light tracking-wide">May the odds be ever in your favor</p>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full"></div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
              onClick={() => setSetupMode("quick")}
              className="group relative overflow-hidden p-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold text-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 hover:border-orange-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">⚡</div>
                <span className="text-2xl font-bold">Quick Start</span>
                <span className="text-base font-normal text-gray-300 group-hover:text-gray-200 transition-colors">
                  Begin with preset configurations
                </span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <button
              onClick={() => setSetupMode("custom")}
              className="group relative overflow-hidden p-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold text-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 hover:border-purple-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">✨</div>
                <span className="text-2xl font-bold">Custom Setup</span>
                <span className="text-base font-normal text-gray-300 group-hover:text-gray-200 transition-colors">
                  Create your own tributes from scratch
                </span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="relative z-10 animate-slide-in">
        {setupMode === "quick" ? (
          <QuickSetup onComplete={handleParticipantSetupComplete} />
        ) : (
          <ParticipantSetup onComplete={handleParticipantSetupComplete} />
        )}
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      <ParticlesBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {!gameState ? renderSetupScreen() : <GameSimulation initialState={gameState} onGameEnd={handleGameEnd} />}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

export default App
