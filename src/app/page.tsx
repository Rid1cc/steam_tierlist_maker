'use client'

import { useState, useRef, useCallback } from 'react'
import Header from '@/components/Header'
import GameImage from '@/components/GameImage'
import TierList from '@/components/TierList'
import GameLibrary from '@/components/GameLibrary'
import SteamImport from '@/components/SteamImport'
import ExportButton from '@/components/ExportButton'
import AboutModal from '@/components/AboutModal'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { steamGames } from '@/data/steamGames'
import { Game, TierData } from '@/types/game'
import TierListSettings from '@/components/TierListSettings'

// Initial tier structure
const initialTiers: TierData = {
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
  F: []
}

// Helper function to find a game by ID in all available containers
const findGameById = (gameId: number, availableGames: Game[], tiers: TierData): { game: Game | null, container: string, index: number } => {
  // Check available games first
  const availableIndex = availableGames.findIndex(game => game.id === gameId)
  if (availableIndex !== -1) {
    return { game: availableGames[availableIndex], container: 'available', index: availableIndex }
  }

  // Check tiers
  for (const [tierKey, tierGames] of Object.entries(tiers)) {
    const tierIndex = tierGames.findIndex(game => game.id === gameId)
    if (tierIndex !== -1) {
      return { game: tierGames[tierIndex], container: tierKey, index: tierIndex }
    }
  }

  return { game: null, container: '', index: -1 }
}

// Helper function to check if two games are in the same container
const areInSameContainer = (activeId: number, overId: number, availableGames: Game[], tiers: TierData): string | null => {
  // Check if both are in available games
  const activeInAvailable = availableGames.some(game => game.id === activeId)
  const overInAvailable = availableGames.some(game => game.id === overId)
  
  if (activeInAvailable && overInAvailable) {
    return 'available'
  }

  // Check if both are in the same tier
  for (const [tierKey, tierGames] of Object.entries(tiers)) {
    const activeInTier = tierGames.some(game => game.id === activeId)
    const overInTier = tierGames.some(game => game.id === overId)
    
    if (activeInTier && overInTier) {
      return tierKey
    }
  }

  return null
}

export default function Home() {
  const [tiers, setTiers] = useState<TierData>(initialTiers)
  const [availableGames, setAvailableGames] = useState<Game[]>(steamGames)
  const [activeGame, setActiveGame] = useState<Game | null>(null)
  const [showSteamImport, setShowSteamImport] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [tierListName, setTierListName] = useState('My Steam Tier List')
  const [tierColors, setTierColors] = useState<Record<string, string>>({})
  const tierListRef = useRef<HTMLDivElement>(null)

  // Handle drag start - find and set the active game
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const gameId = Number(event.active.id)
    const { game } = findGameById(gameId, availableGames, tiers)
    setActiveGame(game)
  }, [availableGames, tiers])

  // Handle reordering games within the same container
  const handleReorder = useCallback((activeId: number, overId: number, container: string) => {
    if (container === 'available') {
      setAvailableGames(prev => {
        const oldIndex = prev.findIndex(game => game.id === activeId)
        const newIndex = prev.findIndex(game => game.id === overId)
        return arrayMove(prev, oldIndex, newIndex)
      })
    } else {
      setTiers(prev => {
        const tierGames = prev[container as keyof TierData]
        const oldIndex = tierGames.findIndex(game => game.id === activeId)
        const newIndex = tierGames.findIndex(game => game.id === overId)
        
        return {
          ...prev,
          [container]: arrayMove(tierGames, oldIndex, newIndex)
        }
      })
    }
  }, [])

  // Handle moving game between different containers
  const handleMove = useCallback((activeId: number, sourceContainer: string, targetContainer: string, targetPosition?: number) => {
    const { game } = findGameById(activeId, availableGames, tiers)
    if (!game) return

    // Remove from source
    if (sourceContainer === 'available') {
      setAvailableGames(prev => prev.filter(g => g.id !== activeId))
    } else {
      setTiers(prev => ({
        ...prev,
        [sourceContainer]: prev[sourceContainer as keyof TierData].filter(g => g.id !== activeId)
      }))
    }

    // Add to target
    if (targetContainer === 'available') {
      setAvailableGames(prev => [...prev, game])
    } else {
      setTiers(prev => {
        const targetGames = [...prev[targetContainer as keyof TierData]]
        if (targetPosition !== undefined) {
          targetGames.splice(targetPosition, 0, game)
        } else {
          targetGames.push(game)
        }
        
        return {
          ...prev,
          [targetContainer]: targetGames
        }
      })
    }
  }, [availableGames, tiers])

  // Main drag end handler - simplified with helper functions
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveGame(null)

    if (!over) return

    const activeId = Number(active.id)
    const overId = Number(over.id)
    const activeData = active.data.current
    const overData = over.data.current
    const { container: sourceContainer } = findGameById(activeId, availableGames, tiers)

    // Handle game-to-game sorting (reordering within same container)
    if (activeData?.type === 'game' && overData?.type === 'game') {
      const sameContainer = areInSameContainer(activeId, overId, availableGames, tiers)
      
      if (sameContainer) {
        handleReorder(activeId, overId, sameContainer)
        return
      }

      // Handle moving between different containers with positioning
      const { container: targetContainer } = findGameById(overId, availableGames, tiers)
      if (sourceContainer && targetContainer && sourceContainer !== targetContainer) {
        const targetGames = targetContainer === 'available' ? availableGames : tiers[targetContainer as keyof TierData]
        const targetIndex = targetGames.findIndex(game => game.id === overId)
        handleMove(activeId, sourceContainer, targetContainer, targetIndex)
        return
      }
    }

    // Handle dropping on tier containers (simpler case)
    const targetContainer = typeof over.id === 'string' ? over.id : over.id.toString()
    if (sourceContainer && targetContainer !== sourceContainer) {
      handleMove(activeId, sourceContainer, targetContainer)
    }
  }, [availableGames, tiers, handleReorder, handleMove])

  // Reset tier list to initial state
  const resetTierList = useCallback(() => {
    setTiers(initialTiers)
    setAvailableGames(steamGames)
  }, [])

  // Modal handlers
  const handleImportSteam = useCallback(() => setShowSteamImport(true), [])
  const handleAbout = useCallback(() => setShowAbout(true), [])

  // Import handlers
  const handleGamesImported = useCallback((games: Game[]) => {
    setAvailableGames(games)
    setTiers(initialTiers) // Reset tiers when importing new games
  }, [])

  const handleGamesReturnToAvailable = useCallback((games: Game[]) => {
    setAvailableGames(prev => [...prev, ...games])
  }, [])

  // Tier customization
  const handleTierColorChange = useCallback((tierKey: string, color: string) => {
    setTierColors(prev => ({
      ...prev,
      [tierKey]: color
    }))
  }, [])

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="min-h-screen">
        <Header onReset={resetTierList} onImportSteam={handleImportSteam} onAbout={handleAbout} />
        <div className="container mx-auto px-4 py-8">
          {/* Settings and Export */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">{tierListName}</h1>
            <div className="flex gap-3">
              <TierListSettings 
                tiers={tiers}
                tierListName={tierListName}
                onTiersChange={setTiers}
                onTierListNameChange={setTierListName}
                onGamesReturnToAvailable={handleGamesReturnToAvailable}
                tierColors={tierColors}
                onTierColorChange={handleTierColorChange}
              />
              <ExportButton tierListRef={tierListRef} />
            </div>
          </div>
          
          {/* Tier List - wrapped in div with ref for export */}
          <div 
            ref={tierListRef} 
            className="tier-list-export bg-steam-darkgray p-6 rounded-lg mb-8"
          >
            <TierList tiers={tiers} tierColors={tierColors} />
          </div>
          
          <GameLibrary games={availableGames} />
        </div>
      </main>
      <DragOverlay>
        {activeGame && (
          <div className="game-item bg-steam-blue rounded-lg overflow-hidden shadow-lg opacity-90 w-[100px] h-[100px] relative">
            <GameImage
              src={activeGame.image}
              alt={activeGame.name}
              fill
              className="object-cover"
              sizes="100px"
              gameName={activeGame.name}
            />
          </div>
        )}
      </DragOverlay>
      
      {/* Steam Import Modal */}
      {showSteamImport && (
        <SteamImport
          onGamesImported={handleGamesImported}
          onClose={() => setShowSteamImport(false)}
        />
      )}
      
      {/* About Modal */}
      {showAbout && (
        <AboutModal
          onClose={() => setShowAbout(false)}
        />
      )}
      
      {/* Footer */}
      <footer className="mt-8 py-6 border-t border-steam-lightblue/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-steam-lightblue/60 text-sm">
            Made with ❤️ by{' '}
            <a 
              href="https://github.com/Rid1cc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ridicc-name relative inline-block font-semibold text-steam-blue transition-all duration-300 cursor-pointer transform hover:scale-110"
            >
              Ridicc
            </a>
          </p>
          <p className="text-steam-lightblue/40 text-xs mt-1">
            Open source project • {new Date().getFullYear()}
          </p>
          <div className="text-steam-lightblue/30 text-xs mt-3 space-y-1">
            <p>
              Powered by{' '}
              <a 
                href="https://steamcommunity.com/dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-steam-blue hover:text-steam-lightblue transition-colors"
              >
                Steam Web API
              </a>
            </p>
            <p>
              Steam and the Steam logo are trademarks of{' '}
              <a 
                href="https://www.valvesoftware.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-steam-blue hover:text-steam-lightblue transition-colors"
              >
                Valve Corporation
              </a>
            </p>
            <p>This application is not affiliated with Valve Corporation</p>
          </div>
        </div>
      </footer>
    </DndContext>
  )
}