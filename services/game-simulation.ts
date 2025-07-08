import type { GameState, Participant, GameEvent, Item } from "../types/game"

const generateUUID = () => crypto.randomUUID()

// Sample items that can be found in the arena
export const ARENA_ITEMS: Item[] = [
  {
    id: generateUUID(),
    name: "Bow and Arrows",
    description: "A reliable ranged weapon for hunting and combat",
    type: "weapon",
    rarity: "uncommon",
    effects: [{ type: "damage", value: 35 }],
    uses: 2,
  },
  {
    id: generateUUID(),
    name: "Crossbow",
    description: "A powerful ranged weapon for silent takedowns.",
    type: "weapon",
    rarity: "rare",
    effects: [{ type: "damage", value: 45 }],
    uses: 1,
  },
  {
    id: generateUUID(),
    name: "Sword",
    description: "A sharp blade for close combat",
    type: "weapon",
    rarity: "common",
    effects: [{ type: "damage", value: 35 }],
    uses: 2,
  },
  {
    id: generateUUID(),
    name: "Dagger",
    description: "A small, easily concealed blade for quick strikes.",
    type: "weapon",
    rarity: "common",
    effects: [{ type: "damage", value: 15 }],
    uses: 1,
  },
  {
    id: generateUUID(),
    name: "Medical Kit",
    description: "Essential supplies for treating wounds",
    type: "medicine",
    rarity: "rare",
    effects: [{ type: "healing", value: 60 }],
    uses: 1,
  },
  {
    id: generateUUID(),
    name: "Herbal Poultice",
    description: "A collection of healing herbs.",
    type: "medicine",
    rarity: "common",
    effects: [{ type: "healing", value: 25 }],
    uses: 2,
  },
  {
    id: generateUUID(),
    name: "Antidote",
    description: "A potent remedy for poisons and toxins.",
    type: "medicine",
    rarity: "rare",
    effects: [{ type: "healing", value: 40 }], // Can be re-purposed for poison removal later
    uses: 1,
  },
  {
    id: generateUUID(),
    name: "Bread",
    description: "Nutritious food to maintain strength",
    type: "food",
    rarity: "common",
    effects: [{ type: "strength", value: 4, duration: 3 }],
    uses: 1,
  },
  {
    id: generateUUID(),
    name: "Water Bottle",
    description: "Clean water for hydration",
    type: "water",
    rarity: "common",
    effects: [{ type: "healing", value: 20 }],
    uses: 2,
  },
  {
    id: generateUUID(),
    name: "Body Armor",
    description: "Protective gear that offers a 20% chance to block an attack.",
    type: "armor",
    rarity: "rare",
    effects: [{ type: "block_chance", value: 20 }],
    uses: 5,
  },
  {
    id: generateUUID(),
    name: "Riot Shield",
    description: "A heavy shield that provides a 50% chance to block an attack.",
    type: "armor",
    rarity: "legendary",
    effects: [{ type: "block_chance", value: 50 }],
    uses: 3,
  },
  {
    id: generateUUID(),
    name: "Explosive Trap",
    description: "A deadly trap for unsuspecting enemies",
    type: "trap",
    rarity: "legendary",
    effects: [{ type: "damage", value: 75 }],
    uses: 1,
  },
  {
    id: generateUUID(),
    name: "Bear Trap",
    description: "A heavy-duty trap designed to incapacitate.",
    type: "trap",
    rarity: "rare",
    effects: [{ type: "damage", value: 50 }],
    uses: 1,
  },
  {
    id: generateUUID(),
    name: "Spike Pit",
    description: "A concealed pit with sharpened spikes.",
    type: "trap",
    rarity: "uncommon",
    effects: [{ type: "damage", value: 30 }],
    uses: 3,
  },
]

// Event templates for different scenarios
const EVENT_TEMPLATES = {
  bloodbath: [
    "{participant1} grabs a {item} from the cornucopia.",
    "{participant1} and {participant2} fight for a bag. {participant1} gives up and retreats.",
    "{participant1} attacks {participant2} with a {weapon}",
    "{participant1} finds a hiding spot and waits for the bloodbath to end.",
    "{participant1} runs away from the cornucopia without grabbing anything.",
    "{participant1} grabs a backpack and retreats.",
    "{participant1} and {participant2} work together to get supplies.",
  ],
  day: [
    "{participant1} hunts for other tributes.",
    "{participant1} camouflages themselves in the bushes.",
    "{participant1} goes hunting for food.",
    "{participant1} receives fresh food from a sponsor.",
    "{participant1} finds a water source.",
    "{participant1} practices with their {weapon}.",
    "{participant1} explores the arena.",
    "{participant1} ambushes {participant2} while they were sleeping",
    "{participant1} and {participant2} form an alliance.",
    "{participant1} sets a trap.",
    "{participant1} accidentally springs a trap!",
    "{participant1} tries to steal from {participant2} while they are sleeping.",
    "{participant1} launches a surprise attack on {participant2}",
    "{participant1} and {participant2} engage in a fierce battle",
    "{participant1} corners {participant2} in a clearing",
    "{participant1} finds injured and decides to attack {participant2}",
    "{participant1} stalks {participant2} through the dense forest",
  ],
  night: [
    "{participant1} starts a fire to keep warm.",
    "{participant1} looks at the night sky and thinks of home.",
    "{participant1} receives medical supplies from a sponsor.",
    "{participant1} quietly stalks {participant2}.",
    "{participant1} attacks {participant2} in their sleep",
    "{participant1} stays awake all night, paranoid.",
    "{participant1} and {participant2} huddle for warmth.",
    "{participant1} tends to their wounds.",
    "{participant1} hears strange noises in the distance.",
    "{participant1} attempts to steal from {participant2}'s supplies.",
    "{participant1} silently creeps into {participant2}'s camp to attack",
    "{participant1} ambushes {participant2} by the water source",
    "{participant1} prepares an assault on {participant2}'s shelter",
  ],
  fallen: [],
  victory: [],
}

export function initializeGame(participants: Participant[]): GameState {
  return {
    participants: participants.map((p) => ({
      ...p,
      status: "alive" as const,
      hp: p.hp || 100,
      maxHp: p.maxHp || 100,
      mood: p.mood || "Calm",
      kills: p.kills || 0,
      allies: p.allies || [],
      inventory: p.inventory || [],
    })),
    events: [],
    day: 1,
    phase: "bloodbath",
    winner: undefined,
    activeTraps: [],
  }
}

export function simulateNextPhase(currentState: GameState): GameState {
  const newState = { ...currentState }
  const aliveParticipants = newState.participants.filter((p) => p.status === "alive")

  // Check for alliance breakup when only two participants are left
  if (aliveParticipants.length === 2) {
    const [p1, p2] = aliveParticipants
    if (p1.allies.includes(p2.id)) {
      p1.allies = []
      p2.allies = []
      newState.events.push({
        id: generateUUID(),
        day: newState.day,
        phase: newState.phase,
        type: "alliance",
        description: `${p1.name} and ${p2.name}'s alliance dissolves as they realize only two remain.`, // More neutral phrasing
        participants: [p1.id, p2.id],
      })
    }
  }

  // Check for victory condition
  if (aliveParticipants.length <= 1) {
    newState.phase = "victory"
    newState.winner = aliveParticipants[0]
    return newState
  }

  // Generate events for current phase
  const newEvents = generatePhaseEvents(newState, aliveParticipants)
  newState.events.push(...newEvents)

  // Advance to next phase
  switch (newState.phase) {
    case "bloodbath":
      newState.phase = "day"
      break
    case "day":
      newState.phase = "night"
      break
    case "night":
      newState.phase = "fallen"
      break
    case "fallen":
      newState.day += 1
      newState.phase = "day"
      break
  }

  return newState
}

function updateParticipantMoods(gameState: GameState): void {
  gameState.participants.forEach((p) => {
    if (p.status === "dead") return

    // Rule-based mood changes
    if (p.hp < p.maxHp * 0.25) {
      p.mood = "Desperate"
    } else if (p.hp < p.maxHp * 0.6) {
      p.mood = "Cautious"
    } else if (gameState.events.some((e) => e.type === "kill" && e.participants[0] === p.id && e.day === gameState.day)) {
      p.mood = "Aggressive"
    } else if (p.allies.length > 0) {
      p.mood = "Brave"
    } else {
      p.mood = "Calm"
    }
  })
}

function generatePhaseEvents(gameState: GameState, aliveParticipants: Participant[]): GameEvent[] {
  const events: GameEvent[] = []
  const phase = gameState.phase

  if (phase === "fallen") {
    // Show fallen tributes from the current day
    const fallenToday = gameState.events
      .filter((e) => e.day === gameState.day && e.type === "kill")
      .map((e) =>
        e.participants.find((p) =>
          gameState.participants.find((participant) => participant.id === p && participant.status === "dead"),
        ),
      )
      .filter(Boolean)

    if (fallenToday.length > 0) {
      events.push({
        id: generateUUID(),
        day: gameState.day,
        phase: "fallen",
        type: "survival",
        description: `${fallenToday.length} tribute${fallenToday.length > 1 ? "s" : ""} fell today.`,
        participants: fallenToday as string[],
      })
    }
    return events
  }

  // Update moods at the beginning of a new day, before events are generated
  if (phase === "day") {
    updateParticipantMoods(gameState)
  }

  let participantsForEvents = [...aliveParticipants]
  const templates = EVENT_TEMPLATES[phase] || EVENT_TEMPLATES.day

  if (phase === "bloodbath") {
    const shuffled = [...aliveParticipants].sort(() => 0.5 - Math.random())
    const numToGetItems = Math.floor(aliveParticipants.length * 0.25)
    const lucky = shuffled.slice(0, numToGetItems)
    participantsForEvents = shuffled.slice(numToGetItems)

    for (const participant of lucky) {
      const itemTemplate = "{participant1} grabs a {item} from the cornucopia."
      const event = generateEventFromTemplate(itemTemplate, participant, null, gameState)
      if (event) {
        events.push(event)
        applyEventEffects(event, gameState)
      }
    }
  }

  const numEvents = Math.min(
    Math.floor(participantsForEvents.length / 2) + Math.floor(Math.random() * 3),
    participantsForEvents.length,
  )

  const unassignedParticipants = [...participantsForEvents]

  for (let i = 0; i < numEvents && unassignedParticipants.length > 0; i++) {
    let currentTemplates = templates.filter((t) => !t.includes("betrays"))
    if (phase === "bloodbath") {
      currentTemplates = templates.filter((t) => !t.includes("grabs a {item}"))
    }

    // Prioritize trap setting if a participant has a trap
    let template: string
    const potentialTrappers = unassignedParticipants.filter(
      (p) => p.inventory.some((item) => item.type === "trap") && currentTemplates.some((t) => t.includes("sets a trap")),
    )

    const potentialAttackers = unassignedParticipants.filter(
      (p) =>
        p.inventory.some((item) => item.type === "weapon") &&
        (p.mood === "Aggressive" || p.mood === "Brave") &&
        currentTemplates.some((t) => t.includes("attacks") || t.includes("ambushes") || t.includes("betrays")),
    )

    const potentialHealers = unassignedParticipants.filter(
      (p) =>
        p.hp < p.maxHp &&
        p.inventory.some((item) => item.type === "medicine") &&
        currentTemplates.some((t) => t.includes("tends to their wounds")),
    )

    if (potentialHealers.length > 0 && Math.random() < 0.5) { // 50% chance to try to heal
      template = currentTemplates.find((t) => t.includes("tends to their wounds")) || currentTemplates[0]
    } else if (potentialTrappers.length > 0 && Math.random() < 0.3) { // 30% chance to try to set a trap
      template = currentTemplates.find((t) => t.includes("sets a trap")) || currentTemplates[0]
    } else if (potentialAttackers.length > 0 && Math.random() < 0.4) { // 40% chance to try to attack
      template = currentTemplates.find(
        (t) => t.includes("attacks") || t.includes("ambushes") || t.includes("betrays"),
      ) || currentTemplates[0]
    } else {
      template = currentTemplates[Math.floor(Math.random() * currentTemplates.length)]
    }

    // Weight participant selection based on mood
    const participant1 = selectParticipantByMood(unassignedParticipants, template)
    removeParticipant(unassignedParticipants, participant1.id)

    let participant2: Participant | null = null

    const isAttackTemplate =
      template.includes("attacks") ||
      template.includes("ambushes") ||
      template.includes("betrays") ||
      template.includes("launches a surprise attack") ||
      template.includes("engage in a fierce battle") ||
      template.includes("corners") ||
      template.includes("finds {participant2} injured and decides to attack") ||
      template.includes("stalks {participant2} through the dense forest") ||
      template.includes("silently creeps into {participant2}'s camp to attack") ||
      template.includes("ambushes {participant2} by the water source") ||
      template.includes("prepares an assault on {participant2}'s shelter")

    if (isAttackTemplate && unassignedParticipants.length > 0) {
      const allies = unassignedParticipants.filter((p) => participant1.allies.includes(p.id))
      const nonAllies = unassignedParticipants.filter((p) => !participant1.allies.includes(p.id))

      let betrayalChance = 0.05 // 5% base chance
      if (participant1.mood === "Aggressive") betrayalChance += 0.1
      if (participant1.mood === "Desperate") betrayalChance += 0.15
      if (participant1.mood === "Brave") betrayalChance -= 0.05
      if (participant1.attributes) {
        betrayalChance += (10 - participant1.attributes.allianceTendency) * 0.02
      }

      if (allies.length > 0 && Math.random() < betrayalChance) {
        // Betrayal!
        participant2 = allies[Math.floor(Math.random() * allies.length)]
        template = `{participant1} betrays and attacks their ally, {participant2}!`
      } else if (nonAllies.length > 0) {
        // Normal attack on a non-ally
        participant2 = nonAllies[Math.floor(Math.random() * nonAllies.length)]
      }
    } else if (unassignedParticipants.length > 0) {
      // Not an attack, or no one to attack, select any participant
      participant2 = unassignedParticipants[Math.floor(Math.random() * unassignedParticipants.length)]
    }

    if (participant2) {
      removeParticipant(unassignedParticipants, participant2.id)
    }

    const event = generateEventFromTemplate(template, participant1, participant2, gameState)

    if (event) {
      events.push(event)
      applyEventEffects(event, gameState)
    }
  }

  return events
}

function selectParticipantByMood(participants: Participant[], template: string): Participant {
  if (participants.length === 0) throw new Error("Cannot select a participant from an empty list.")

  const weights = new Map<Participant, number>()

  participants.forEach((p) => {
    let weight = 1 // Base weight
    if (template.includes("kills")) {
      if (p.mood === "Aggressive") weight = 4
      if (p.mood === "Brave") weight = 2
      if (p.mood === "Cautious") weight = 0.5
    } else if (template.includes("hunts") || template.includes("explores")) {
      if (p.mood === "Brave") weight = 3
      if (p.mood === "Calm") weight = 2
    } else if (template.includes("hiding") || template.includes("retreats")) {
      if (p.mood === "Cautious") weight = 4
      if (p.mood === "Desperate") weight = 3
    }
    weights.set(p, weight)
  })

  const totalWeight = Array.from(weights.values()).reduce((sum, weight) => sum + weight, 0)
  if (totalWeight === 0) {
    return participants[Math.floor(Math.random() * participants.length)]
  }

  let random = Math.random() * totalWeight
  for (const [participant, weight] of weights.entries()) {
    random -= weight
    if (random <= 0) {
      return participant
    }
  }

  // Fallback, should not be reached frequently
  return participants[participants.length - 1]
}

function removeParticipant(participants: Participant[], id: string): void {
  const index = participants.findIndex((p) => p.id === id)
  if (index > -1) {
    participants.splice(index, 1)
  }
}

function generateEventFromTemplate(
  template: string,
  participant1: Participant,
  participant2: Participant | null,
  gameState: GameState,
): GameEvent | null {
  if (!participant1) return null

  const isAttackTemplate =
    template.includes("attacks") ||
    template.includes("ambushes") ||
    template.includes("betrays") ||
    template.includes("launches a surprise attack") ||
    template.includes("engage in a fierce battle") ||
    template.includes("corners") ||
    template.includes("finds {participant2} injured and decides to attack") ||
    template.includes("stalks {participant2} through the dense forest") ||
    template.includes("silently creeps into {participant2}'s camp to attack") ||
    template.includes("ambushes {participant2} by the water source") ||
    template.includes("prepares an assault on {participant2}'s shelter")

  let description = template
    .replace(/{participant1}/g, participant1.name)
    .replace(/{participant2}/g, participant2?.name || "another tribute")

  let eventType: GameEvent["type"] = "survival"
  const participants = [participant1.id]
  let itemUsed: Item | undefined

  // Intelligence-based item discovery for certain events
  if (
    participant1.attributes &&
    (template.includes("hunts for food") || template.includes("explores the arena"))
  ) {
    const discoveryChance = 0.1 + participant1.attributes.intelligence * 0.05 // 10% base + 2% per INT point
    if (Math.random() < discoveryChance) {
      // Participant finds an item
      const itemRarityRoll = Math.random()
      let possibleItems = ARENA_ITEMS.filter((i) => i.rarity === "common")
      if (itemRarityRoll < 0.2 + participant1.attributes.intelligence * 0.03) {
        // 20% base + 3% per INT point chance for uncommon
        possibleItems = ARENA_ITEMS.filter((i) => i.rarity === "uncommon")
      }
      if (itemRarityRoll < 0.05 + participant1.attributes.intelligence * 0.02) {
        // 5% base + 2% per INT point chance for rare
        possibleItems = ARENA_ITEMS.filter((i) => i.rarity === "rare")
      }
      if (itemRarityRoll < 0.01 + participant1.attributes.intelligence * 0.01) {
        // 1% base + 1% per INT point chance for legendary
        possibleItems = ARENA_ITEMS.filter((i) => i.rarity === "legendary")
      }

      if (possibleItems.length > 0) {
        itemUsed = possibleItems[Math.floor(Math.random() * possibleItems.length)]
        description = `${participant1.name} finds a ${itemUsed.name} while ${
          template.includes("hunts") ? "hunting" : "exploring"
        }.`
        eventType = "item"
      }
    }
  }

  // Determine event type based on template content
  if (template.includes("steal from") && participant2) {
    eventType = "steal"
    participants.push(participant2.id)

    if (
      participant1.attributes &&
      participant2.attributes &&
      participant2.inventory.length > 0
    ) {
      const p1Intel = participant1.attributes.intelligence
      const p2Intel = participant2.attributes.intelligence
      // Intelligence contest with RNG
      const thiefRoll = p1Intel + Math.floor(Math.random() * 10) + 1 // d10 roll
      const targetRoll = p2Intel + Math.floor(Math.random() * 6) + 1 // d6 roll

      if (thiefRoll > targetRoll) {
        // Successful steal
        const stolenItemIndex = Math.floor(Math.random() * participant2.inventory.length)
        const stolenItem = participant2.inventory[stolenItemIndex]

        // Move item
        participant2.inventory.splice(stolenItemIndex, 1)
        participant1.inventory.push(stolenItem)

        // Attach the stolen item to the event for UI rendering
        itemUsed = stolenItem
        description = `${participant1.name} successfully steals from ${participant2.name}!`
      } else {
        // Failed steal
        description = `${participant1.name} fails to steal from ${participant2.name} and is caught!`
      }
    } else {
      // No items to steal or attributes missing
      description = `${participant1.name} tries to steal from ${participant2.name} but finds nothing.`
    }
  } else if (eventType === "survival" && isAttackTemplate && participant2) {
    eventType = "kill"
    participants.push(participant2.id)
    // Find a weapon in the attacker's inventory
    const weapon = participant1.inventory.find((i) => i.type === "weapon")
    if (weapon) {
      itemUsed = weapon
      description = description.replace(/{weapon}/g, weapon.name)
    } else {
      // Fallback if no weapons are in inventory
      description = description.replace(" with a {weapon}", "")
    }
  } else if (template.includes("receives fresh food from a sponsor")) {
    eventType = "item"
    const foodItems = ARENA_ITEMS.filter((i) => i.type === "food")
    if (foodItems.length > 0) {
      itemUsed = foodItems[Math.floor(Math.random() * foodItems.length)]
      description = `${participant1.name} receives a ${itemUsed.name} from a sponsor.`
    }
  } else if (template.includes("receives medical supplies from a sponsor")) {
    eventType = "item"
    const medItems = ARENA_ITEMS.filter((i) => i.type === "medicine")
    if (medItems.length > 0) {
      itemUsed = medItems[Math.floor(Math.random() * medItems.length)]
      description = `${participant1.name} receives a ${itemUsed.name} from a sponsor.`
    }
  } else if (template.includes("sets a trap")) {
    const trapItem = participant1.inventory.find((i) => i.type === "trap")
    if (trapItem) {
      eventType = "trap"
      itemUsed = trapItem
      // Remove trap from inventory
      participant1.inventory = participant1.inventory.filter((i) => i.id !== trapItem.id)
      description = `${participant1.name} sets a trap using a ${trapItem.name}.`
      // Add to active traps
      gameState.activeTraps.push({ id: generateUUID(), setterId: participant1.id, item: trapItem })
    } else {
      description = `${participant1.name} looks for a good place to set a trap.`
    }
  } else if (template.includes("springs a trap")) {
    if (gameState.activeTraps.length > 0) {
      // Someone falls into a trap
      const trapIndex = Math.floor(Math.random() * gameState.activeTraps.length)
      const triggeredTrap = gameState.activeTraps[trapIndex]
      const setter = gameState.participants.find((p) => p.id === triggeredTrap.setterId)

      if (setter && setter.id !== participant1.id) {
        eventType = "trap"
        itemUsed = triggeredTrap.item
        participants.push(setter.id) // [victim, setter]
        description = `${participant1.name} accidentally triggers a trap set by ${setter.name}!`
        // Remove the trap from the active list
        gameState.activeTraps.splice(trapIndex, 1)
      } else {
        // Can't trigger your own trap, or setter not found
        description = `${participant1.name} carefully navigates around a suspicious area.`
      }
    } else {
      // No active traps
      description = `${participant1.name} cautiously explores the area, finding nothing amiss.`
    }
  } else if (template.includes("tends to their wounds")) {
    const medItem = participant1.inventory.find((i) => i.type === "medicine")
    if (medItem) {
      eventType = "item" // Will trigger healing effect in applyEventEffects
      itemUsed = medItem
      description = `${participant1.name} tends to their wounds using a ${medItem.name}.`
    } // else, the default description remains
  } else if (template.includes("practices with their {weapon}")) {
    const weapon = participant1.inventory.find((i) => i.type === "weapon")
    if (weapon) {
      itemUsed = weapon
      description = `${participant1.name} practices with their ${weapon.name}.`
    } else {
      description = `${participant1.name} practices their combat moves.`
    }
  } else if (template.includes("alliance") || template.includes("work together")) {
    eventType = "alliance"
    if (participant2) participants.push(participant2.id)
  } else if (eventType !== "item" && (template.includes("{item}") || template.includes("{weapon}"))) {
    // Generic item event
    eventType = "item"
    const randomItem = ARENA_ITEMS[Math.floor(Math.random() * ARENA_ITEMS.length)]
    itemUsed = randomItem
    description = description
      .replace(/{item}/g, randomItem.name)
      .replace(/{weapon}/g, randomItem.name)
  }

  // Final check for placeholders
  description = description.replace(/{item}/g, "supplies").replace(/{weapon}/g, "fists")

  return {
    id: generateUUID(),
    day: gameState.day,
    phase: gameState.phase,
    type: eventType,
    description,
    participants,
    itemUsed,
  }
}

function applyEventEffects(event: GameEvent, gameState: GameState): void {
  switch (event.type) {
    case "kill": {
      if (event.participants.length < 2) break

      const killerId = event.participants[0]
      const victimId = event.participants[1]

      const victim = gameState.participants.find((p) => p.id === victimId)
      if (!victim || victim.status === "dead") break

      // Check for protection
      const killer = gameState.participants.find((p) => p.id === killerId)
      if (victim.inventory.length > 0 && killer) {
        for (const item of victim.inventory) {
          const blockEffect = item.effects?.find((e) => e.type === "block_chance")
          if (blockEffect && typeof item.uses !== "undefined" && item.uses > 0) {
            if (Math.random() < blockEffect.value / 100) {
              // Block successful
              item.uses--
              event.description = `${killer.name}'s attack on ${victim.name} was blocked by their ${item.name}!`

              if (item.uses === 0) {
                event.description += ` However, the ${item.name} broke in the process.`
                // Remove item if uses are depleted
                victim.inventory = victim.inventory.filter((i) => i.id !== item.id)
              }
              return // No damage taken
            }
          }
        }
      }

      // 20% chance of instant kill, otherwise deal damage
      if (Math.random() < 0.2) {
        const damageDealt = victim.hp
        victim.hp = 0
        event.description += `, dealing a critical hit of ${damageDealt} damage!`
      } else {
        // Determine damage
        const strengthBonus = killer?.attributes?.strength ? Math.floor(killer.attributes.strength / 2) : 0
        let damage = Math.floor(Math.random() * 51) + 50 + strengthBonus // Base damage between 30-100 + strength bonus
        if (event.itemUsed && event.itemUsed.effects) {
          const damageEffect = event.itemUsed.effects.find((e) => e.type === "damage")
          if (damageEffect) damage = damageEffect.value + strengthBonus
        }

        const damageDealt = Math.min(victim.hp, damage)
        victim.hp = Math.max(0, victim.hp - damage)
        event.description += `, dealing ${damageDealt} damage.`

        if (killer && event.itemUsed?.type === "weapon") {
          const weaponInInventory = killer.inventory.find((i) => i.id === event.itemUsed!.id)
          if (weaponInInventory && typeof weaponInInventory.uses !== "undefined") {
            weaponInInventory.uses--
            if (weaponInInventory.uses === 0) {
              event.description += ` Their ${weaponInInventory.name} broke from the effort.`
              killer.inventory = killer.inventory.filter((i) => i.id !== weaponInInventory.id)
            }
          }
        }
      }

      // Check for death
      if (victim.hp === 0) {
        victim.status = "dead"
        const killer = gameState.participants.find((p) => p.id === killerId)
        if (killer) {
          killer.kills += 1

          // Looting mechanism
          if (victim.inventory.length > 0) {
            const lootedItems: string[] = []
            victim.inventory.forEach((item) => {
              if (Math.random() < 0.5) {
                // 50% chance to loot each item
                lootedItems.push(item.name)
                killer.inventory.push({ ...item, id: generateUUID() })
              }
            })

            if (lootedItems.length > 0) {
              event.description += ` ${killer.name} loots ${lootedItems.join(", ")} from the body.`
            }
          }
        }
      }
      break
    }

    case "item": {
      if (!event.itemUsed || event.participants.length === 0) break
      const participant = gameState.participants.find((p) => p.id === event.participants[0])
      if (!participant) break

      // Check if this is an item usage event or an item receiving event
      const isItemUsage = event.description.includes("tends to their wounds") || 
                          event.description.includes("practices with") ||
                          event.description.includes("uses");
      
      if (isItemUsage) {
        // This is an item usage event - find the item in inventory and decrement uses
        const inventoryItemIndex = participant.inventory.findIndex(i => 
          i.name === event.itemUsed!.name && i.type === event.itemUsed!.type);
        
        if (inventoryItemIndex > -1) {
          // Apply item effects
          if (event.itemUsed.effects) {
            event.itemUsed.effects.forEach((effect) => {
              if (effect.type === "healing") {
                participant.hp = Math.min(participant.maxHp, participant.hp + effect.value)
              }
            });
          }
          
          // Decrement uses
          if (typeof participant.inventory[inventoryItemIndex].uses !== 'undefined') {
            participant.inventory[inventoryItemIndex].uses!--;
            
            // Remove if no uses left
            if (participant.inventory[inventoryItemIndex].uses === 0) {
              participant.inventory.splice(inventoryItemIndex, 1);
            }
          }
        }
      } else {
        // This is an item receiving event - add to inventory
        // Apply immediate effects if any
        if (event.itemUsed.effects) {
          event.itemUsed.effects.forEach((effect) => {
            if (effect.type === "healing") {
              participant.hp = Math.min(participant.maxHp, participant.hp + effect.value)
            }
          });
        }
        
        // Add to inventory with a new ID
        const newItem = { ...event.itemUsed, id: generateUUID() };
        participant.inventory.push(newItem);
      }
      break;
    }

    case "alliance": {
      if (event.participants.length < 2) break
      const [p1Id, p2Id] = event.participants
      const p1 = gameState.participants.find((p) => p.id === p1Id)
      const p2 = gameState.participants.find((p) => p.id === p2Id)

      if (p1 && p2) {
        if (!p1.allies.includes(p2Id)) p1.allies.push(p2Id)
        if (!p2.allies.includes(p1Id)) p2.allies.push(p1Id)
      }
      break
    }

    case "trap": {
      if (!event.itemUsed || event.participants.length < 2) break
      const victimId = event.participants[0]
      const setterId = event.participants[1]
      const victim = gameState.participants.find((p) => p.id === victimId)

      if (victim) {
        let damage = 0
        const damageEffect = event.itemUsed.effects?.find((e) => e.type === "damage")
        if (damageEffect) damage = damageEffect.value

        const damageDealt = Math.min(victim.hp, damage)
        victim.hp = Math.max(0, victim.hp - damage)
        event.description += ` It explodes, dealing ${damageDealt} damage.`

        if (victim.hp === 0) {
          victim.status = "dead"
          const setter = gameState.participants.find((p) => p.id === setterId)
          if (setter) {
            setter.kills += 1
          }
        }
      }
      break
    }
  }
}