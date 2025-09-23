import { Game } from '@/types/game'
import { useState } from 'react'

// Simple thumbnail component with text fallback
function GameThumbnail({ src, alt, gameName }: { src: string, alt: string, gameName: string }) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className="w-12 h-12 bg-steam-blue flex items-center justify-center rounded text-white text-xs font-medium text-center">
        {gameName.split(' ').slice(0, 2).join(' ').slice(0, 10)}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 object-cover rounded bg-steam-blue"
      onError={() => setImageError(true)}
      loading="lazy"
    />
  )
}

interface GamePreviewListProps {
  games: Game[]
  loading: boolean
  onImport: () => void
}

export default function GamePreviewList({ games, loading, onImport }: GamePreviewListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-steam-blue mx-auto mb-4"></div>
        <p className="text-gray-400">Loading Steam games...</p>
      </div>
    )
  }

  if (games.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          Found {games.length} games
        </h3>
        <button
          onClick={onImport}
          className="btn-steam-green"
        >
          Import All Games
        </button>
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-2">
        {games.slice(0, 50).map((game) => (
          <div
            key={game.id}
            className="flex items-center gap-3 p-2 bg-steam-darkblue rounded border border-steam-lightblue"
          >
            <GameThumbnail 
              src={game.image}
              alt={game.name}
              gameName={game.name}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium truncate">
                  {game.name}
                </p>
                {game.isShared && (
                  <span className="text-xs bg-purple-600 text-white px-1 rounded">
                    SHARED
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs">
                {(game.playtime ?? 0) > 0 ? `${game.playtime}h played` : 'Never played'}
              </p>
            </div>
          </div>
        ))}
        {games.length > 50 && (
          <p className="text-center text-gray-400 text-sm py-2">
            ... and {games.length - 50} more games
          </p>
        )}
      </div>
    </div>
  )
}