import { useDroppable } from '@dnd-kit/core'
import { Game, TierKey } from '@/types/game'
import GameItem from './GameItem'

interface TierRowProps {
  tier: TierKey
  games: Game[]
}

const tierColors = {
  S: 'bg-tier-S',
  A: 'bg-tier-A', 
  B: 'bg-tier-B',
  C: 'bg-tier-C',
  D: 'bg-tier-D',
  F: 'bg-tier-F'
}

const tierLabels = {
  S: 'S - Legendary',
  A: 'A - Excellent',
  B: 'B - Good',
  C: 'C - Average',
  D: 'D - Below Average',
  F: 'F - Poor'
}

export default function TierRow({ tier, games }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: tier,
  })

  return (
    <div className="flex mb-4">
      {/* Tier Label */}
      <div className={`${tierColors[tier]} w-24 flex items-center justify-center text-black font-bold text-2xl rounded-l-lg border-2 border-r-0 border-steam-lightblue`}>
        {tier}
      </div>
      
      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`tier-row flex-1 p-4 flex flex-wrap gap-2 items-start content-start rounded-r-lg border-2 border-l-0 border-steam-lightblue transition-colors ${
          isOver ? 'bg-steam-lightblue bg-opacity-20' : 'bg-steam-blue bg-opacity-30'
        }`}
        style={{ minHeight: '120px' }}
      >
        {games.map((game) => (
          <GameItem key={game.id} game={game} />
        ))}
        {games.length === 0 && (
          <p className="text-gray-400 text-sm self-center">
            Drag games here to rank them as {tierLabels[tier]}
          </p>
        )}
      </div>
    </div>
  )
}