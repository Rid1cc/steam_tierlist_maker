'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import TierList from '@/components/TierList'
import GameLibrary from '@/components/GameLibrary'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { steamGames } from '@/data/steamGames'
import { Game, TierData } from '@/types/game'

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
    const overId = over.id as string

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

    // Determine destination
    const destinationContainer = overId.includes('-') ? overId.split('-')[0] : overId

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
    } else {
      setTiers(prev => ({
        ...prev,
        [destinationContainer]: [...prev[destinationContainer as keyof TierData], draggedGame]
      }))
    }
  }

  const resetTierList = () => {
    setTiers(initialTiers)
    setAvailableGames(steamGames)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="min-h-screen">
        <Header onReset={resetTierList} />
        <div className="container mx-auto px-4 py-8">
          <TierList tiers={tiers} />
          <GameLibrary games={availableGames} />
        </div>
      </main>
      <DragOverlay>
        {activeGame && (
          <div className="game-item bg-steam-blue rounded-lg overflow-hidden shadow-lg opacity-90 w-[100px] h-[100px] relative">
            <Image
              src={activeGame.image}
              alt={activeGame.name}
              fill
              className="object-cover"
              sizes="100px"
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}