import type React from "react"
import type { Participant } from "../types/game"
import InventoryDisplay from "./inventory-display"

interface ParticipantDisplayProps {
  participant: Participant
  showDetails: boolean
}

const getMoodIndicator = (mood: Participant["mood"]) => {
  switch (mood) {
    case "Aggressive":
      return { icon: "😠", color: "text-red-400", label: "Aggressive" }
    case "Brave":
      return { icon: "🦁", color: "text-yellow-400", label: "Brave" }
    case "Cautious":
      return { icon: "🧐", color: "text-blue-400", label: "Cautious" }
    case "Desperate":
      return { icon: "😨", color: "text-purple-400", label: "Desperate" }
    case "Calm":
    default:
      return { icon: "😌", color: "text-green-400", label: "Calm" }
  }
}

const ParticipantDisplay: React.FC<ParticipantDisplayProps> = ({ participant, showDetails }) => {
  const isDead = participant.status === "dead"
  const moodInfo = getMoodIndicator(participant.mood)

  return (
    <div
      className={`relative p-4 rounded-2xl transition-all duration-300 transform-gpu ${
        isDead
          ? "bg-black/50 filter grayscale"
          : "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 hover:shadow-2xl"
      }`}
    >
      <div className={`absolute top-2 right-2 text-2xl filter ${isDead ? "" : "drop-shadow-lg"}`}>
        {isDead ? "💀" : "❤️"}
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src={participant.image || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${participant.name}`}
            alt={participant.name}
            className={`w-24 h-24 rounded-full object-cover border-4 ${
              isDead ? "border-gray-600" : "border-purple-400/50"
            } shadow-md`}
          />
          {showDetails && !isDead && (
            <div
              className={`absolute -bottom-2 -right-2 px-2 py-1 text-sm rounded-full bg-black/50 border border-white/20 ${moodInfo.color}`}
              title={moodInfo.label}
            >
              {moodInfo.icon}
            </div>
          )}
        </div>
        <h4
          className={`text-lg tracking-wide ${isDead ? "text-gray-400" : "text-black"}`}
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {participant.name}
        </h4>

        {showDetails && !isDead && (
          <div className="w-full mt-3 space-y-3">
            <div className="relative w-full bg-black/30 rounded-full h-5 border border-white/10 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(participant.hp / participant.maxHp) * 100}%` }}
              ></div>
              <span className="absolute inset-0 text-xs font-bold flex items-center justify-center text-white text-shadow">
                {participant.hp} / {participant.maxHp} HP
              </span>
            </div>
            {participant.attributes && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-black/20 p-1 rounded-md">
                  <span className="font-bold text-orange-400">💪 {participant.attributes.strength}</span>
                </div>
                <div className="bg-black/20 p-1 rounded-md">
                  <span className="font-bold text-blue-400">🧠 {participant.attributes.intelligence}</span>
                </div>
                <div className="bg-black/20 p-1 rounded-md">
                  <span className="font-bold text-green-400">🤝 {participant.attributes.allianceTendency}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full border-t border-white/10 my-3"></div>

        <div className="flex justify-around w-full text-xs">
          <div className="text-center">
            <span className="font-bold text-base text-red-400">{participant.kills}</span>
            <span className="block text-gray-300">Kills</span>
          </div>
          <div className="text-center">
            <span className="font-bold text-base text-blue-400">{participant.allies.length}</span>
            <span className="block text-gray-300">Allies</span>
          </div>
        </div>

        {showDetails && (
          <div className="w-full mt-4">
            <InventoryDisplay items={participant.inventory} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ParticipantDisplay
