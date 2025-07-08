import type React from "react"
import type { Item, ItemRarity, ItemType } from "../types/game"

interface InventoryDisplayProps {
  items: Item[]
  className?: string
}

const rarityStyles: Record<ItemRarity, { text: string; border: string; shadow: string; bg: string }> = {
  common: {
    text: "text-gray-300",
    border: "border-gray-500/50",
    shadow: "hover:shadow-gray-500/20",
    bg: "from-gray-500/10 to-gray-600/10",
  },
  uncommon: {
    text: "text-green-400",
    border: "border-green-500/50",
    shadow: "hover:shadow-green-500/20",
    bg: "from-green-500/10 to-green-600/10",
  },
  rare: {
    text: "text-blue-400",
    border: "border-blue-500/50",
    shadow: "hover:shadow-blue-500/20",
    bg: "from-blue-500/10 to-blue-600/10",
  },
  legendary: {
    text: "text-purple-400",
    border: "border-purple-500/50",
    shadow: "hover:shadow-purple-500/20",
    bg: "from-purple-500/10 to-purple-600/10",
  },
}

const itemIcons: Record<ItemType, string> = {
  weapon: "⚔️",
  medicine: "💊",
  food: "🍖",
  water: "💧",
  armor: "🛡️",
  trap: "💥",
  tool: "🔧",
}

const InventoryDisplay: React.FC<InventoryDisplayProps> = ({ items, className = "" }) => {
  const glassmorphismStyle = "bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-sm border rounded-xl"

  if (!items || items.length === 0) {
    return (
      <div
        className={`
        text-gray-400 italic p-6 text-center
        border-2 border-dashed border-gray-700/50 rounded-xl
        bg-gradient-to-br from-gray-800/20 to-gray-900/20
        ${className}
      `}
      >
        <div className="text-3xl mb-2">📦</div>
        <div>Inventory is empty</div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`
            group p-4 transition-all duration-300 hover:scale-[1.02]
            ${glassmorphismStyle}
            ${rarityStyles[item.rarity].border}
            ${rarityStyles[item.rarity].shadow}
            bg-gradient-to-r ${rarityStyles[item.rarity].bg}
            animate-fade-in
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`
              w-14 h-14 flex items-center justify-center rounded-xl
              text-3xl flex-shrink-0 transition-all duration-300
              bg-gradient-to-br from-black/40 to-black/20
              border ${rarityStyles[item.rarity].border}
              group-hover:scale-110 group-hover:rotate-12
            `}
            >
              {itemIcons[item.type]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`font-bold truncate text-lg ${rarityStyles[item.rarity].text} group-hover:text-white transition-colors duration-300`}
                >
                  {item.name}
                </div>
                {item.uses !== undefined && (
                  <div
                    className={`
                    text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap
                    bg-gradient-to-r from-black/40 to-black/20
                    border ${rarityStyles[item.rarity].border}
                    ${rarityStyles[item.rarity].text}
                    group-hover:scale-105 transition-transform duration-300
                  `}
                  >
                    {item.uses} use{item.uses !== 1 ? "s" : ""}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-300 opacity-90 mb-3 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {item.description}
              </div>

              <div className="flex flex-wrap gap-2">
                {item.effects.map((effect, effectIndex) => (
                  <span
                    key={effectIndex}
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                      bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm
                      border ${rarityStyles[item.rarity].border}
                      ${rarityStyles[item.rarity].text}
                      hover:scale-105 transition-transform duration-300
                    `}
                  >
                    {effect.type.charAt(0).toUpperCase() + effect.type.slice(1)}:
                    <span className="ml-1 font-extrabold">
                      {effect.value > 0 && "+"}
                      {effect.value}
                    </span>
                    {effect.duration && <span className="ml-2 opacity-75 text-xs">({effect.duration}⏱️)</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default InventoryDisplay
