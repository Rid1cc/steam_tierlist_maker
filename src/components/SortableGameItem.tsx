import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Game } from '@/types/game'
import GameImage from './GameImage'

interface SortableGameItemProps {
  game: Game
}

export default function SortableGameItem({ game }: SortableGameItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: game.id,
    data: {
      type: 'game',
      game,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDragStart = (event: React.DragEvent) => {
    // Create empty/transparent drag image to hide native drag preview
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    event.dataTransfer.setDragImage(img, 0, 0)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDragStart={handleDragStart}
      title={game.name}
      className={`game-item bg-steam-blue rounded-lg overflow-hidden shadow-lg cursor-grab active:cursor-grabbing ${
        isDragging ? 'invisible' : ''
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