import { useDroppable } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Game, TierKey } from '@/types/game'
import SortableGameItem from './SortableGameItem'

interface TierRowProps {
  tier: TierKey
  games: Game[]
  customColor?: string
}

const tierColors: Record<string, string> = {
  S: 'bg-tier-S',
  A: 'bg-tier-A', 
  B: 'bg-tier-B',
  C: 'bg-tier-C',
  D: 'bg-tier-D',
  F: 'bg-tier-F'
}

const tierLabels: Record<string, string> = {
  S: 'S - Legendary',
  A: 'A - Excellent',
  B: 'B - Good',
  C: 'C - Average',
  D: 'D - Below Average',
  F: 'F - Poor'
}

// Fallback color for custom tiers
const getDefaultTierColor = (tier: string) => {
  return tierColors[tier] || 'bg-steam-blue'
}

const getDefaultTierLabel = (tier: string) => {
  return tierLabels[tier] || `${tier} - Custom`
}

export default function TierRow({ tier, games, customColor }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: String(tier),
  })

  return (
    <div className="flex mb-4">
      {/* Tier Label */}
      <div 
        className={`w-24 flex items-center justify-center text-black font-bold text-2xl rounded-l-lg border-2 border-r-0 border-steam-lightblue ${!customColor ? getDefaultTierColor(String(tier)) : ''}`}
        style={customColor ? { backgroundColor: customColor } : undefined}
      >
        {String(tier)}
      </div>
      
      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`tier-row flex-1 p-4 flex flex-wrap gap-2 items-start content-start rounded-r-lg border-2 border-l-0 border-steam-lightblue transition-colors ${
          isOver ? 'bg-steam-lightblue bg-opacity-20' : 'bg-steam-blue bg-opacity-30'
        }`}
        style={{ minHeight: '120px' }}
      >
        <SortableContext items={games.map(game => game.id)} strategy={horizontalListSortingStrategy}>
          {games.map((game) => (
            <SortableGameItem key={game.id} game={game} />
          ))}
        </SortableContext>
        {games.length === 0 && (
          <p className="text-gray-400 text-sm self-center">
            Drag games here to rank them as {tierLabels[tier]}
          </p>
        )}
      </div>
    </div>
  )
}