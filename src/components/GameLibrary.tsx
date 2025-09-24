import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Game } from '@/types/game'
import SortableGameItem from './SortableGameItem'

type SortOption = 'name-asc' | 'name-desc' | 'playtime-asc' | 'playtime-desc' | 'default'

interface GameLibraryProps {
  games: Game[]
}

export default function GameLibrary({ games }: GameLibraryProps) {
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [hideUnplayed, setHideUnplayed] = useState(false)
  const { setNodeRef, isOver } = useDroppable({
    id: 'available',
  })

  // Filter and sort games
  const filteredGames = hideUnplayed 
    ? games.filter(game => (game.playtime || 0) > 0)
    : games

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'playtime-asc':
        return (a.playtime || 0) - (b.playtime || 0)
      case 'playtime-desc':
        return (b.playtime || 0) - (a.playtime || 0)
      default:
        return 0 // Keep original order
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Game Library ({sortedGames.length}{hideUnplayed ? '' : `/${games.length}`} games)
          </h2>
          <div className="flex items-center gap-4 mt-1">
            {sortOption !== 'default' && (
              <p className="text-sm text-steam-green">
                Sorted by {
                  sortOption === 'name-asc' ? 'Name (A → Z)' :
                  sortOption === 'name-desc' ? 'Name (Z → A)' :
                  sortOption === 'playtime-asc' ? 'Playtime (Low → High)' :
                  'Playtime (High → Low)'
                }
              </p>
            )}
            {hideUnplayed && (
              <p className="text-sm text-orange-400">
                Showing only played games
              </p>
            )}
            <p className="text-xs text-gray-400">
              {games.filter(game => (game.playtime || 0) > 0).length} played • {games.filter(game => (game.playtime || 0) === 0).length} unplayed
            </p>
          </div>
        </div>
        
        {/* Filter and Sort Options */}
        <div className="flex items-center gap-4">
          {/* Hide Unplayed Checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors group">
            <div className="relative">
              <input
                type="checkbox"
                checked={hideUnplayed}
                onChange={(e) => setHideUnplayed(e.target.checked)}
                className="sr-only focus:ring-2 focus:ring-steam-green focus:ring-offset-2 focus:ring-offset-steam-darkgray"
              />
              <div className={`
                w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center relative
                ${hideUnplayed 
                  ? 'bg-steam-green border-steam-green shadow-lg shadow-steam-green/60 scale-105' 
                  : 'bg-steam-darkblue border-steam-lightblue group-hover:border-steam-green/70 group-hover:shadow-md group-hover:shadow-steam-green/25 group-hover:scale-105'
                }
              `}>
                <svg className={`w-3 h-3 text-white transition-all duration-200 ${
                  hideUnplayed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </div>
            </div>
            <span className="flex items-center gap-1 group-hover:text-steam-green transition-colors">
              {hideUnplayed ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.829m-5.096-5.096A9.959 9.959 0 003 12c1.274 4.057 5.065 7 9 7 .848 0 1.67-.124 2.448-.355m1.178-5.599c.33-.734.354-1.56.072-2.322a3 3 0 00-3.72-3.72c-.762-.282-1.588-.258-2.322.072M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
              Hide unplayed
            </span>
          </label>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort by:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3 py-2 bg-steam-darkblue text-white text-sm rounded border border-steam-lightblue focus:border-steam-green outline-none hover:bg-steam-blue transition-colors cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="playtime-asc">Playtime (Low → High)</option>
              <option value="playtime-desc">Playtime (High → Low)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card-steam p-6">
        <div
          ref={setNodeRef}
          className={`min-h-[120px] flex flex-wrap gap-2 p-4 rounded-lg border-2 border-dashed transition-colors ${
            isOver 
              ? 'border-steam-green bg-steam-green bg-opacity-10' 
              : 'border-steam-lightblue bg-steam-darkblue bg-opacity-50'
          }`}
        >
          <SortableContext items={sortedGames.map(game => game.id)} strategy={rectSortingStrategy}>
            {sortedGames.map((game) => (
              <SortableGameItem key={game.id} game={game} />
            ))}
          </SortableContext>
          {sortedGames.length === 0 && (
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