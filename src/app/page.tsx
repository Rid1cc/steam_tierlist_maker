'use client'

import { useState, useRef } from 'react'
import Header from '@/components/Header'
import GameImage from '@/components/GameImage'
import TierList from '@/components/TierList'
import GameLibrary from '@/components/GameLibrary'
import SteamImport from '@/components/SteamImport'
import ExportButton from '@/components/ExportButton'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, DragOverEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { steamGames } from '@/data/steamGames'
import { Game, TierData } from '@/types/game'
import TierListSettings from '@/components/TierListSettings'

const initialTiers: TierData = {
  S: [],
  A: [],
  B: [],
  C: [],
  D: [],
  F: []
}

export default function Home() {
  const [tiers, setTiers] = useState<TierData>(initialTiers)
  const [availableGames, setAvailableGames] = useState<Game[]>(steamGames)
  const [activeGame, setActiveGame] = useState<Game | null>(null)
  const [showSteamImport, setShowSteamImport] = useState(false)
  const [tierListName, setTierListName] = useState('My Steam Tier List')
  const [tierColors, setTierColors] = useState<Record<string, string>>({})
  const tierListRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const gameId = Number(active.id)
    
    // Find the game in available games or in any tier
    let game = availableGames.find((g: Game) => g.id === gameId)
    if (!game) {
      for (const tierGames of Object.values(tiers)) {
        game = tierGames.find((g: Game) => g.id === gameId)
        if (game) break
      }
    }
    setActiveGame(game || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveGame(null)

    if (!over) return

    const activeId = Number(active.id)
    const overId = over.id

    // Find source location
    let sourceContainer = 'available'
    let sourceIndex = availableGames.findIndex(game => game.id === activeId)
    
    if (sourceIndex === -1) {
      for (const [tierKey, tierGames] of Object.entries(tiers)) {
        const index = tierGames.findIndex((game: Game) => game.id === activeId)
        if (index !== -1) {
          sourceContainer = tierKey
          sourceIndex = index
          break
        }
      }
    }

    // Check if we're sorting within containers
    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type === 'game' && overData?.type === 'game') {
      console.log('Sorting games - activeId:', activeId, 'overId:', overId)
      
      // Check if both games are in available games
      const activeInAvailable = availableGames.some((game: Game) => game.id === activeId)
      const overInAvailable = availableGames.some((game: Game) => game.id === Number(overId))
      
      if (activeInAvailable && overInAvailable) {
        console.log('Sorting within available games')
        // Reorder within available games
        setAvailableGames(prev => {
          const oldIndex = prev.findIndex((game: Game) => game.id === activeId)
          const newIndex = prev.findIndex((game: Game) => game.id === Number(overId))
          return arrayMove(prev, oldIndex, newIndex)
        })
        return
      }

      // Find which tier both games are in
      let tierKey = ''
      for (const [key, tierGames] of Object.entries(tiers)) {
        if (tierGames.some((game: Game) => game.id === activeId) && tierGames.some((game: Game) => game.id === Number(overId))) {
          tierKey = key
          break
        }
      }

      if (tierKey) {
        console.log('Sorting within tier:', tierKey)
        // Reorder within the same tier
        setTiers(prev => {
          const tierGames = prev[tierKey as keyof TierData]
          const oldIndex = tierGames.findIndex((game: Game) => game.id === activeId)
          const newIndex = tierGames.findIndex((game: Game) => game.id === Number(overId))
          
          return {
            ...prev,
            [tierKey]: arrayMove(tierGames, oldIndex, newIndex)
          }
        })
        return
      }

      // Check if dragging from one tier to another tier (game to game)
      let sourceTier = ''
      let targetTier = ''
      
      // Find source tier
      for (const [key, tierGames] of Object.entries(tiers)) {
        if (tierGames.some((game: Game) => game.id === activeId)) {
          sourceTier = key
          break
        }
      }
      
      // Find target tier
      for (const [key, tierGames] of Object.entries(tiers)) {
        if (tierGames.some((game: Game) => game.id === Number(overId))) {
          targetTier = key
          break
        }
      }
      
      if (sourceTier && targetTier && sourceTier !== targetTier) {
        console.log('Moving from tier', sourceTier, 'to tier', targetTier)
        const activeGame = [...availableGames, ...Object.values(tiers).flat()].find((game: Game) => game.id === activeId)
        if (activeGame) {
          setTiers(prev => {
            const targetGames = prev[targetTier as keyof TierData]
            const targetIndex = targetGames.findIndex((game: Game) => game.id === Number(overId))
            
            // Remove from source tier
            const newSourceGames = prev[sourceTier as keyof TierData].filter((game: Game) => game.id !== activeId)
            
            // Insert into target tier at the target position
            const newTargetGames = [...targetGames]
            newTargetGames.splice(targetIndex, 0, activeGame)
            
            return {
              ...prev,
              [sourceTier]: newSourceGames,
              [targetTier]: newTargetGames
            }
          })
          return
        }
      }
    }

    // Handle dragging from available games to tier (game to game)
    if (activeData?.type === 'game' && overData?.type === 'game') {
      const activeInAvailable = availableGames.some((game: Game) => game.id === activeId)
      let targetTier = ''
      
      // Find target tier
      for (const [key, tierGames] of Object.entries(tiers)) {
        if (tierGames.some((game: Game) => game.id === Number(overId))) {
          targetTier = key
          break
        }
      }
      
      if (activeInAvailable && targetTier) {
        console.log('Moving from available to tier', targetTier)
        const activeGame = availableGames.find((game: Game) => game.id === activeId)
        if (activeGame) {
          const targetGames = tiers[targetTier as keyof TierData]
          const targetIndex = targetGames.findIndex((game: Game) => game.id === Number(overId))
          
          // Remove from available games
          setAvailableGames(prev => prev.filter((game: Game) => game.id !== activeId))
          
          // Insert into target tier at the target position
          setTiers(prev => {
            const newTargetGames = [...prev[targetTier as keyof TierData]]
            newTargetGames.splice(targetIndex, 0, activeGame)
            
            return {
              ...prev,
              [targetTier]: newTargetGames
            }
          })
          return
        }
      }
    }

    // Handle moving between containers (original logic)
    const destinationContainer = typeof overId === 'string' ? overId : overId.toString()

    // Get the dragged game
    const draggedGame = sourceContainer === 'available' 
      ? availableGames[sourceIndex]
      : tiers[sourceContainer as keyof TierData][sourceIndex]

    if (!draggedGame) return

    // Remove from source
    if (sourceContainer === 'available') {
      setAvailableGames(prev => prev.filter(game => game.id !== activeId))
    } else {
      setTiers(prev => ({
        ...prev,
        [sourceContainer]: prev[sourceContainer as keyof TierData].filter(game => game.id !== activeId)
      }))
    }

    // Add to destination
    if (destinationContainer === 'available') {
      setAvailableGames(prev => [...prev, draggedGame])
    } else if (destinationContainer in tiers) {
      setTiers(prev => ({
        ...prev,
        [destinationContainer]: [...(prev[destinationContainer as keyof TierData] || []), draggedGame]
      }))
    }
  }

  const resetTierList = () => {
    setTiers(initialTiers)
    setAvailableGames(steamGames)
  }

  const handleImportSteam = () => {
    setShowSteamImport(true)
  }

  const handleGamesImported = (games: Game[]) => {
    setAvailableGames(games)
    setTiers(initialTiers) // Reset tiers when importing new games
  }

  const handleGamesReturnToAvailable = (games: Game[]) => {
    setAvailableGames(prev => [...prev, ...games])
  }

  const handleTierColorChange = (tierKey: string, color: string) => {
    setTierColors(prev => ({
      ...prev,
      [tierKey]: color
    }))
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="min-h-screen">
        <Header onReset={resetTierList} onImportSteam={handleImportSteam} />
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
            Steam Tierlist Maker • {new Date().getFullYear()}
          </p>
          <p className="text-steam-lightblue/30 text-xs mt-2">
            All game data and images are property of Valve Corporation and Steam®
          </p>
        </div>
      </footer>
    </DndContext>
  )
}