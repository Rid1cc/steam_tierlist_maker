import { useDraggable } from '@dnd-kit/core'
import { Game } from '@/types/game'
import GameImage from './GameImage'

interface GameItemProps {
  game: Game
}

export default function GameItem({ game }: GameItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: game.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`game-item bg-steam-blue rounded-lg overflow-hidden shadow-lg cursor-grab active:cursor-grabbing ${
        isDragging ? 'dragging opacity-50' : ''
      }`}
    >
      <div className="relative w-[100px] h-[100px]">
        <GameImage
          src={game.image}
          alt={game.name}
          fill
          className="w-full h-full object-cover"
          sizes="100px"
          gameName={game.name}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <p className="text-white text-xs text-center px-1 font-semibold">
            {game.name}
          </p>
        </div>
      </div>
    </div>
  )
}