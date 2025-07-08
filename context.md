# 🏹 Hunger Games Simulator - Project Brief

## 🧠 Overview

We are developing an **interactive Hunger Games simulation platform**. This is a web-based application where users can set up a customized version of the Hunger Games with their own characters. It mimics the randomness and drama of the original series in an entertaining, shareable format.

---

## 🎯 Main Features

### 1. **Participant Setup**

- The user inputs the total number of participants (e.g., 12, 24, etc.).
- For each participant, the user can:
  - 🔤 Enter a custom name.
  - 🖼️ Upload a custom profile image (e.g., PNG, JPG).
  - 🧠 (Optional) Assign attributes such as strength, intelligence, or alliance tendencies for advanced mode.

### 2. **Simulation Phases**

The simulation is broken down into **daily phases**, each with random events:

- **Bloodbath** (initial carnage at the Cornucopia).
- **Day Events** (alliances, fights, hunts, discoveries).
- **Night Events** (ambushes, bonding, stealth kills).
- **Deaths Summary** (list of fallen tributes).
- **Canon Shots** (accompanied by sound and image effect).
- **Victory Phase** (declares a winner, displays statistics).

### 3. **UI Features**

- 🗺️ Dynamic arena display (text + optional arena image).
- 🧾 Scrollable event log per day.
- 🧍 Survivor list with profile pics and current status (alive/dead).
- 🥇 Victory screen with confetti and stats.

---

## 🔧 Tech Specs (Flexible for Claude)

### Required Components

- React (or Vue/Svelte)
- Tailwind CSS (for styling)
- State Management (React useState/useReducer or similar)
- Local image upload preview
- Random event generation (can use weighted probabilities)
- JSON structure for participants and events

---

## 🧩 Suggested Data Structure

```json
{
  "participants": [
    {
      "name": "Katniss",
      "image": "katniss.png",
      "status": "alive",
      "kills": 1,
      "allies": ["Peeta"]
    }
  ],
  "day": 1,
  "events": [
    {
      "type": "kill",
      "actor": "Cato",
      "target": "Rue",
      "description": "Cato brutally killed Rue with a spear."
    },
    {
      "type": "alliance",
      "participants": ["Katniss", "Peeta"],
      "description": "Katniss and Peeta form an uneasy alliance."
    }
  ]
}

🛠 Optional Features (Stretch Goals)

    ✅ Save/load simulation state.

    🌐 Shareable URL with snapshot of current game.

    💬 Comment system for observers to react to each day.

    🎙️ Text-to-speech narration of events.

💡 Visual/Interaction Inspiration

    BrantSteele Hunger Games Simulator

    Survivor/Big Brother Simulators

    AI Dungeon-like storytelling UI

🧪 Testing Instructions

    Start simulation with 8 custom participants (names + images).

    Ensure day progression and death events trigger.

    Confirm win condition triggers correctly when only one tribute remains.

🧵 Styling Notes

    Keep a survival journal aesthetic (parchment backgrounds, typewriter fonts).

    Use animations for deaths and canon shots (e.g., red flash, gunshot sound).

    Keep layout mobile-responsive.

🏁 Goal

An engaging, customizable Hunger Games experience that users can replay and share, driven by personalized characters and random storytelling.
