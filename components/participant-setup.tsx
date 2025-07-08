"use client"

import type React from "react"
import { useState } from "react"
import type { Participant } from "../types/game"

const generateUUID = () => crypto.randomUUID()

interface ParticipantSetupProps {
  onComplete: (participants: Participant[]) => void
}

const ParticipantSetup: React.FC<ParticipantSetupProps> = ({ onComplete }) => {
  const [participantCount, setParticipantCount] = useState<number>(12)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentName, setCurrentName] = useState("")
  const [currentImage, setCurrentImage] = useState<string>()
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCurrentImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!currentName.trim()) {
      setError("Tribute name is required.")
      return
    }

    const newParticipant: Participant = {
      id: editIndex !== null ? participants[editIndex].id : generateUUID(),
      name: currentName.trim(),
      image: currentImage,
      status: "alive",
      hp: 100,
      maxHp: 100,
      mood: "Calm",
      kills: 0,
      allies: [],
      inventory: [],
      attributes: {
        strength: Math.floor(Math.random() * 10) + 1,
        intelligence: Math.floor(Math.random() * 10) + 1,
        allianceTendency: Math.floor(Math.random() * 10) + 1,
      },
    }

    let updatedParticipants
    if (editIndex !== null) {
      updatedParticipants = [...participants]
      updatedParticipants[editIndex] = newParticipant
    } else {
      if (participants.length >= participantCount) {
        setError(`Cannot add more than ${participantCount} participants.`)
        return
      }
      updatedParticipants = [...participants, newParticipant]
    }

    setParticipants(updatedParticipants)
    setEditIndex(null)
    setCurrentName("")
    setCurrentImage(undefined)
    setError(null)

    const fileInput = document.getElementById("image-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleEdit = (index: number) => {
    const participant = participants[index]
    setCurrentName(participant.name)
    setCurrentImage(participant.image)
    setEditIndex(index)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
    if (editIndex === index) {
      setEditIndex(null)
      setCurrentName("")
      setCurrentImage(undefined)
    }
  }

  const handleComplete = () => {
    if (participants.length !== participantCount) {
      setError(`Please set up exactly ${participantCount} participants.`)
      return
    }
    onComplete(participants)
  }

  const glassmorphismStyle =
    "bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <header className="text-center mb-12 animate-fade-in">
        <div className="relative">
          <h2
            className="text-5xl md:text-6xl font-bold tracking-wider uppercase bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Custom Game Setup
          </h2>
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl -z-10 rounded-full"></div>
        </div>
        <p className="text-xl text-gray-300 mt-4 font-light">Create your tributes and define the arena.</p>
        <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
      </header>

      <div className={`p-8 mb-12 ${glassmorphismStyle} hover:shadow-purple-500/10 transition-all duration-500`}>
        <div className="mb-8">
          <label className="block text-xl font-semibold mb-4 text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Number of Tributes (2-24):
          </label>
          <div className="relative">
            <input
              type="number"
              min={2}
              max={24}
              value={participantCount}
              onChange={(e) => setParticipantCount(Math.min(24, Math.max(2, Number.parseInt(e.target.value) || 2)))}
              className={`w-40 px-6 py-4 text-xl font-bold text-center ${glassmorphismStyle} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300`}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <label className="block font-semibold text-lg text-purple-300">Tribute Name:</label>
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className={`w-full px-6 py-4 text-lg ${glassmorphismStyle} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 hover:shadow-lg`}
                placeholder="e.g., Katniss Everdeen"
              />
            </div>
            <div className="space-y-3">
              <label className="block font-semibold text-lg text-purple-300">Tribute Image:</label>
              <div className="relative">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 file:transition-all file:duration-300 ${glassmorphismStyle} p-4 hover:shadow-lg transition-all duration-300`}
                />
              </div>
            </div>
          </div>

          {currentImage && (
            <div className="flex justify-center animate-fade-in">
              <div className="relative">
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full shadow-2xl border-4 border-purple-400/50"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20"></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02]"
          >
            {editIndex !== null ? "✨ Update Tribute" : `⚔️ Add Tribute ${participants.length + 1}/${participantCount}`}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-400/30 text-white rounded-2xl text-center shadow-2xl animate-fade-in">
          <div className="text-2xl mb-2">⚠️</div>
          {error}
        </div>
      )}

      <div className="text-center mb-10">
        <h3
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Tributes ({participants.length}/{participantCount})
        </h3>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
        {participants.map((p, i) => (
          <div
            key={p.id}
            className={`group p-6 flex flex-col items-center text-center ${glassmorphismStyle} transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 hover:border-purple-400/40`}
          >
            <div className="relative mb-4">
              <img
                src={
                  p.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random&color=fff`
                }
                alt={p.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-400/50 shadow-xl group-hover:border-purple-400 transition-all duration-300"
                onError={(e) =>
                  (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=2a2a2a&color=fff`)
                }
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <h4 className="font-bold text-lg mb-3 group-hover:text-purple-300 transition-colors duration-300">
              {p.name}
            </h4>

            <div className="grid grid-cols-3 gap-2 text-xs mb-4 w-full">
              <div className="bg-black/20 rounded-lg p-2 border border-white/10">
                <div className="text-gray-400">💪 STR</div>
                <div className="font-bold text-orange-400">{p.attributes?.strength}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/10">
                <div className="text-gray-400">🧠 INT</div>
                <div className="font-bold text-blue-400">{p.attributes?.intelligence}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-2 border border-white/10">
                <div className="text-gray-400">🤝 ALL</div>
                <div className="font-bold text-green-400">{p.attributes?.allianceTendency}</div>
              </div>
            </div>

            <div className="mt-auto flex space-x-3">
              <button
                onClick={() => handleEdit(i)}
                className="text-blue-400 hover:text-blue-300 text-sm font-semibold px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-8">
        <button
          onClick={handleComplete}
          disabled={participants.length !== participantCount}
          className={`px-12 py-5 rounded-2xl font-bold text-xl uppercase tracking-wider transition-all duration-500 transform hover:scale-105 shadow-2xl ${
            participants.length !== participantCount
              ? "bg-gray-600/50 cursor-not-allowed opacity-50 border border-gray-500/30"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-green-500/25 animate-pulse border border-green-400/30"
          }`}
        >
          🏹 Begin The Games
        </button>

        <button
          onClick={() => window.location.reload()}
          className="px-12 py-5 rounded-2xl font-bold text-xl uppercase tracking-wider bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-gray-600/50 hover:to-gray-700/50 text-white border border-gray-600/30 hover:border-white/30 transition-all duration-500 transform hover:scale-105 shadow-2xl"
        >
          ← Back to Setup
        </button>
      </div>
    </div>
  )
}

export default ParticipantSetup
