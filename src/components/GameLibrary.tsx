import { useDroppable } from '@dnd-kit/core'
import { Game } from '@/types/game'
import GameItem from './GameItem'

interface GameLibraryProps {
  games: Game[]
}

export default function GameLibrary({ games }: GameLibraryProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'available',
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Game Library ({games.length} games)
      </h2>
      <div className="card-steam p-6">
        <div
          ref={setNodeRef}
          className={`min-h-[120px] flex flex-wrap gap-2 p-4 rounded-lg border-2 border-dashed transition-colors ${
            isOver 
              ? 'border-steam-green bg-steam-green bg-opacity-10' 
              : 'border-steam-lightblue bg-steam-darkblue bg-opacity-50'
          }`}
        >
          {games.map((game) => (
            <GameItem key={game.id} game={game} />
          ))}
          {games.length === 0 && (
            <div className="w-full text-center text-gray-400 py-8">
              <p className="text-lg">All games have been ranked!</p>
              <p className="text-sm">Use the reset button to start over</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}