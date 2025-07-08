import type { Participant } from "../types/game"

export interface GamePreset {
  name: string
  description: string
  participants: Participant[]
}

const generateUUID = () => crypto.randomUUID()

const createParticipant = (name: string, image?: string): Participant => ({
  id: generateUUID(),
  name,
  image,
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
})

export const PRESETS: GamePreset[] = [
  {
    name: "Classic Hunger Games",
    description:
      "The original 24 tributes from the 12 districts of Panem. Experience the brutal competition that started it all.",
    participants: [
      createParticipant("Katniss Everdeen"),
      createParticipant("Peeta Mellark"),
      createParticipant("Cato"),
      createParticipant("Clove"),
      createParticipant("Thresh"),
      createParticipant("Rue"),
      createParticipant("Foxface"),
      createParticipant("Marvel"),
      createParticipant("Glimmer"),
      createParticipant("District 3 Male"),
      createParticipant("District 3 Female"),
      createParticipant("District 4 Female"),
      createParticipant("District 5 Male"),
      createParticipant("District 6 Male"),
      createParticipant("District 6 Female"),
      createParticipant("District 7 Male"),
      createParticipant("District 7 Female"),
      createParticipant("District 8 Male"),
      createParticipant("District 8 Female"),
      createParticipant("District 9 Male"),
      createParticipant("District 9 Female"),
      createParticipant("District 10 Male"),
      createParticipant("District 10 Female"),
      createParticipant("District 11 Male"),
    ],
  },
  {
    name: "Fantasy Heroes",
    description:
      "Legendary heroes from fantasy realms clash in the ultimate battle. Magic meets steel in this epic confrontation.",
    participants: [
      createParticipant("Aragorn"),
      createParticipant("Legolas"),
      createParticipant("Gimli"),
      createParticipant("Gandalf"),
      createParticipant("Daenerys Targaryen"),
      createParticipant("Jon Snow"),
      createParticipant("Tyrion Lannister"),
      createParticipant("Arya Stark"),
      createParticipant("Geralt of Rivia"),
      createParticipant("Yennefer"),
      createParticipant("Conan the Barbarian"),
      createParticipant("Red Sonja"),
    ],
  },
  {
    name: "Sci-Fi Warriors",
    description:
      "Futuristic fighters with advanced technology and alien abilities. The arena becomes a battlefield of tomorrow.",
    participants: [
      createParticipant("Master Chief"),
      createParticipant("Samus Aran"),
      createParticipant("Commander Shepard"),
      createParticipant("Ripley"),
      createParticipant("Sarah Connor"),
      createParticipant("Neo"),
      createParticipant("Trinity"),
      createParticipant("Morpheus"),
      createParticipant("Luke Skywalker"),
      createParticipant("Princess Leia"),
      createParticipant("Han Solo"),
      createParticipant("Chewbacca"),
      createParticipant("Darth Vader"),
      createParticipant("Boba Fett"),
      createParticipant("Predator"),
      createParticipant("Xenomorph"),
    ],
  },
  {
    name: "Anime Champions",
    description:
      "Powerful anime characters with incredible abilities face off. Expect explosive battles and dramatic showdowns.",
    participants: [
      createParticipant("Goku"),
      createParticipant("Vegeta"),
      createParticipant("Naruto"),
      createParticipant("Sasuke"),
      createParticipant("Ichigo"),
      createParticipant("Luffy"),
      createParticipant("Natsu"),
      createParticipant("Edward Elric"),
      createParticipant("Saitama"),
      createParticipant("Tanjiro"),
      createParticipant("Eren Yeager"),
      createParticipant("Levi Ackerman"),
    ],
  },
  {
    name: "Historical Legends",
    description:
      "Great warriors and leaders from throughout history. See how ancient tactics fare in the modern arena.",
    participants: [
      createParticipant("Alexander the Great"),
      createParticipant("Julius Caesar"),
      createParticipant("Joan of Arc"),
      createParticipant("William Wallace"),
      createParticipant("Spartacus"),
      createParticipant("Cleopatra"),
      createParticipant("Hannibal"),
      createParticipant("Sun Tzu"),
      createParticipant("Genghis Khan"),
      createParticipant("Napoleon"),
      createParticipant("Miyamoto Musashi"),
      createParticipant("Saladin"),
      createParticipant("Richard the Lionheart"),
      createParticipant("Boudica"),
      createParticipant("Attila the Hun"),
      createParticipant("King Arthur"),
    ],
  },
]
