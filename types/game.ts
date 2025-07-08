export interface Participant {
  id: string
  name: string
  image?: string
  status: "alive" | "dead"
  hp: number
  maxHp: number
  mood: Mood
  kills: number
  allies: string[]
  inventory: Item[]
  attributes?: {
    strength: number
    intelligence: number
    allianceTendency: number
  }
}

export type Mood = "Brave" | "Cautious" | "Aggressive" | "Desperate" | "Calm"

export interface Item {
  id: string
  name: string
  description: string
  type: ItemType
  rarity: ItemRarity
  effects: ItemEffect[]
  uses?: number
}

export type ItemType = "weapon" | "medicine" | "food" | "water" | "armor" | "trap" | "tool"
export type ItemRarity = "common" | "uncommon" | "rare" | "legendary"

export interface ItemEffect {
  type: ItemEffectType
  value: number
  duration?: number
  chance?: number
}

export type ItemEffectType =
  | "damage"
  | "healing"
  | "strength"
  | "intelligence"
  | "stealth"
  | "block_chance"

export interface ActiveTrap {
  id: string
  setterId: string
  item: Item
}

export interface GameEvent {
  id: string
  day: number
  phase: GamePhase
  type: "kill" | "alliance" | "item" | "survival" | "trap" | "steal"
  description: string
  participants: string[]
  itemUsed?: Item
}

export type GamePhase = "bloodbath" | "day" | "night" | "fallen" | "victory"

export interface GameState {
  participants: Participant[]
  events: GameEvent[]
  day: number
  phase: GamePhase
  winner?: Participant
  activeTraps: ActiveTrap[]
}
