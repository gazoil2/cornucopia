"use client"

import type React from "react"
import { PRESETS, type GamePreset } from "../data/presets"
import type { Participant, Mood } from "../types/game"
import { ARENA_ITEMS } from "../services/game-simulation"

const generateUUID = () => crypto.randomUUID()

interface QuickSetupProps {
  onComplete: (participants: Participant[]) => void
}

const QuickSetup: React.FC<QuickSetupProps> = ({ onComplete }) => {
  const handlePresetClick = (preset: GamePreset) => {
    const participants = preset.participants.map((p) => ({
      ...p,
      id: generateUUID(),
      hp: 100,
      maxHp: 100,
      mood: "Calm" as Mood,
      kills: 0,
      allies: [],
      inventory: [],
      attributes: {
        strength: Math.floor(Math.random() * 10) + 1,
        intelligence: Math.floor(Math.random() * 10) + 1,
        allianceTendency: Math.floor(Math.random() * 10) + 1,
      },
    }))
    onComplete(participants)
  }

  const handleTrapModeClick = () => {
    const explosiveTrap = ARENA_ITEMS.find((item) => item.name === "Explosive Trap")
    if (!explosiveTrap) {
      console.error("Explosive Trap preset not found.")
      return
    }

    // Use the first preset as a base for participants
    const basePreset = PRESETS[0]
    const participants = basePreset.participants.map((p) => ({
      ...p,
      id: generateUUID(),
      hp: 100,
      maxHp: 100,
      mood: "Calm" as Mood,
      kills: 0,
      allies: [],
      inventory: [{ ...explosiveTrap, id: generateUUID() }], // Add the trap
      attributes: {
        strength: Math.floor(Math.random() * 10) + 1,
        intelligence: Math.floor(Math.random() * 10) + 1,
        allianceTendency: Math.floor(Math.random() * 10) + 1,
      },
    }))

    onComplete(participants)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        Quick Setup
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className="group p-6 rounded-2xl transition-all duration-300 transform-gpu bg-gradient-to-br from-white/10 to-white/5 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-white/20"
          >
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">
              {preset.name}
            </h3>
            <p className="text-gray-400 text-sm">{preset.description}</p>
          </button>
        ))}
        <button
          onClick={handleTrapModeClick}
          className="group p-6 rounded-2xl transition-all duration-300 transform-gpu bg-gradient-to-br from-white/10 to-white/5 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-white/20"
        >
          <div className="text-2xl mb-3">💣</div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-red-300 transition-colors duration-300">
            Explosive Start
          </h3>
          <p className="text-gray-400 text-sm">All tributes start with one explosive trap.</p>
        </button>
      </div>
    </div>
  )
}

export default QuickSetup
