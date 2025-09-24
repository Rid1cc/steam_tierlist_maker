'use client'

import { useState } from 'react'
import { Game, TierData, TierKey } from '@/types/game'

interface TierListSettingsProps {
  tiers: TierData
  tierListName: string
  onTiersChange: (tiers: TierData) => void
  onTierListNameChange: (name: string) => void
  onGamesReturnToAvailable: (games: Game[]) => void
  tierColors?: Record<string, string>
  onTierColorChange?: (tierKey: string, color: string) => void
}

const tierColors: Array<{ name: string; color: string; bgColor: string; isCustom?: boolean }> = [
  { name: 'Red', color: '#ff7f80', bgColor: '#fef2f2' },
  { name: 'Orange', color: '#ffbf7f', bgColor: '#fff7ed' },
  { name: 'Yellow', color: '#ffdf80', bgColor: '#fefce8' },
  { name: 'Light Yellow', color: '#ffff7f', bgColor: '#fefce8' },
  { name: 'Light Green', color: '#bfff7f', bgColor: '#f0fdf4' },
  { name: 'Green', color: '#7fff7f', bgColor: '#f0fdf4' },
  { name: 'Purple', color: '#a855f7', bgColor: '#faf5ff' },
  { name: 'Pink', color: '#ec4899', bgColor: '#fdf2f8' },
  { name: 'Steam Blue', color: '#1b2838', bgColor: '#66c0f4' },
  { name: 'Custom', color: '#ffffff', bgColor: '#ffffff', isCustom: true },
]

// Current tier colors mapping from TierRow component (pastel colors)
const currentTierColors: Record<string, string> = {
  'S': '#ff7f80', // Pastel Red (S tier)
  'A': '#ffbf7f', // Pastel Orange (A tier)
  'B': '#ffdf80', // Pastel Yellow (B tier)
  'C': '#ffff7f', // Light Yellow (C tier)
  'D': '#bfff7f', // Light Green (D tier)
  'F': '#7fff7f', // Pastel Green (F tier)
}

export default function TierListSettings({ 
  tiers, 
  tierListName, 
  onTiersChange, 
  onTierListNameChange,
  onGamesReturnToAvailable,
  tierColors: customTierColors,
  onTierColorChange
}: TierListSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [newTierName, setNewTierName] = useState('')
  const [selectedTierForColor, setSelectedTierForColor] = useState<string | null>(null)
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false)
  const [customColorValue, setCustomColorValue] = useState('#ffffff')

  const tierOrder: TierKey[] = ['S', 'A', 'B', 'C', 'D']
  
  const getTierDisplayName = (key: TierKey) => {
    const tierNames: Record<TierKey, string> = {
      'S': 'S Tier',
      'A': 'A Tier', 
      'B': 'B Tier',
      'C': 'C Tier',
      'D': 'D Tier',
      'F': 'F Tier'
    }
    return tierNames[key] || key
  }

  const addNewTier = () => {
    if (!newTierName.trim()) return
    
    const newTierKey = newTierName.toUpperCase().charAt(0)
    
    // Check if tier already exists
    if (tiers.hasOwnProperty(newTierKey)) {
      alert('Tier already exists!')
      return
    }
    
    const updatedTiers = {
      ...tiers,
      [newTierKey]: []
    }
    
    onTiersChange(updatedTiers as TierData)
    setNewTierName('')
  }

  const deleteTier = (tierKey: string) => {
    if (Object.keys(tiers).length <= 1) {
      alert('Cannot delete the last tier!')
      return
    }
    
    // Get games from the tier being deleted
    const tierGames = tiers[tierKey] || []
    
    // Remove the tier
    const updatedTiers = { ...tiers }
    delete updatedTiers[tierKey]
    
    // Return games to available games
    if (tierGames.length > 0) {
      onGamesReturnToAvailable(tierGames)
    }
    
    // Notify parent about tier change
    onTiersChange(updatedTiers as TierData)
  }

  const renameTier = (oldKey: string, newName: string) => {
    if (!newName.trim()) return
    
    const newKey = newName.toUpperCase().charAt(0)
    if (newKey === oldKey) return
    
    // Check if new tier name already exists
    if (tiers.hasOwnProperty(newKey)) {
      alert('Tier with this name already exists!')
      return
    }
    
    const updatedTiers = { ...tiers }
    updatedTiers[newKey] = updatedTiers[oldKey]
    delete updatedTiers[oldKey]
    
    onTiersChange(updatedTiers as TierData)
    setEditingTier(null)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-steam-blue text-white px-4 py-3 rounded-lg hover:bg-steam-lightblue transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-steam-darkblue border border-steam-blue rounded-lg shadow-2xl p-6 w-96 z-50 backdrop-blur-sm" style={{ minWidth: '384px', maxWidth: '384px' }}>
          <div className="space-y-6">
            {/* Tier List Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tier List Name
              </label>
              <input
                type="text"
                value={tierListName}
                onChange={(e) => onTierListNameChange(e.target.value)}
                className="w-full px-3 py-2 text-white border border-steam-blue rounded-lg focus:border-steam-blue focus:outline-none"
                style={{ 
                  backgroundColor: '#1b2838', 
                  color: 'white',
                  boxSizing: 'border-box'
                }}
                placeholder="My Steam Tier List"
              />
            </div>

            {/* Existing Tiers */}
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Manage Tiers</h3>
              <div className="space-y-2">
                {Object.keys(tiers).map((tierKey) => (
                  <div key={tierKey} className="flex items-center gap-2 p-2 bg-steam-darkblue rounded-lg" style={{ height: '40px', minHeight: '40px' }}>
                    <button
                      className="w-6 h-6 rounded border-2 border-white hover:border-steam-lightblue transition-colors"
                      style={{ backgroundColor: customTierColors?.[tierKey] || currentTierColors[tierKey] || tierColors[0].color }}
                      onClick={() => setSelectedTierForColor(tierKey)}
                      title="Change tier color"
                    />
                    
                    {editingTier === tierKey ? (
                      <input
                        type="text"
                        defaultValue={tierKey}
                        onBlur={(e) => renameTier(String(tierKey), e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            renameTier(String(tierKey), e.currentTarget.value)
                          }
                        }}
                        className="flex-1 px-2 text-white border border-steam-blue rounded text-sm focus:border-steam-blue focus:outline-none"
                        style={{ 
                          backgroundColor: '#1b2838', 
                          color: 'white',
                          boxSizing: 'border-box',
                          minWidth: '0',
                          height: '24px',
                          lineHeight: 1
                        }}
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="flex-1 cursor-pointer text-sm font-medium text-white flex items-center"
                        style={{ height: '24px', lineHeight: 1 }}
                        onClick={() => setEditingTier(tierKey)}
                      >
                        {getTierDisplayName(tierKey as TierKey)} ({tiers[tierKey as TierKey]?.length || 0} games)
                      </span>
                    )}
                    
                    <button
                      onClick={() => deleteTier(String(tierKey))}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete tier"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Tier */}
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Add New Tier</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTierName}
                  onChange={(e) => setNewTierName(e.target.value)}
                  placeholder="Tier name (e.g., F, SS)"
                  className="flex-1 px-3 py-2 text-white border border-steam-blue rounded-lg text-sm focus:border-steam-blue focus:outline-none"
                  style={{ 
                    backgroundColor: '#1b2838', 
                    color: 'white',
                    boxSizing: 'border-box',
                    minWidth: '0'
                  }}
                />
                <button
                  onClick={addNewTier}
                  className="bg-steam-blue text-white px-4 py-2 rounded-lg hover:bg-steam-lightblue transition-colors text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Color Picker */}
            {selectedTierForColor && (
              <div>
                <h3 className="text-sm font-medium text-white mb-3">
                  Choose Color for Tier "{selectedTierForColor}"
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {tierColors.map((color) => (
                    <button
                      key={color.name}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-steam-blue transition-colors"
                      onClick={() => {
                        if (color.isCustom) {
                          setShowCustomColorPicker(true)
                        } else {
                          if (onTierColorChange) {
                            onTierColorChange(selectedTierForColor, color.color)
                          }
                          setSelectedTierForColor(null)
                        }
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded border border-white flex items-center justify-center"
                        style={{ backgroundColor: color.isCustom ? 'transparent' : color.color }}
                      >
                        {color.isCustom && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2V4a2 2 0 012-2h11a2 2 0 00-2-2H4z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM6 8a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-white">{color.name}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Color Picker */}
                {showCustomColorPicker && (
                  <div className="mb-3 p-3 bg-steam-darkgray rounded-lg border border-steam-blue">
                    <h4 className="text-xs font-medium text-white mb-2">Choose Custom Color</h4>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customColorValue}
                        onChange={(e) => setCustomColorValue(e.target.value)}
                        className="w-8 h-8 rounded border border-steam-blue cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColorValue}
                        onChange={(e) => setCustomColorValue(e.target.value)}
                        className="flex-1 px-2 py-1 text-white border border-steam-blue rounded text-xs focus:border-steam-blue focus:outline-none"
                        style={{ 
                          backgroundColor: '#1b2838', 
                          color: 'white',
                          boxSizing: 'border-box',
                          minWidth: '0'
                        }}
                        placeholder="#ffffff"
                      />
                      <button
                        onClick={() => {
                          if (onTierColorChange) {
                            onTierColorChange(selectedTierForColor, customColorValue)
                          }
                          setSelectedTierForColor(null)
                          setShowCustomColorPicker(false)
                        }}
                        className="bg-steam-blue text-white px-3 py-1 rounded text-xs hover:bg-steam-lightblue transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedTierForColor(null)
                    setShowCustomColorPicker(false)
                  }}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-steam-blue text-white px-4 py-2 rounded-lg hover:bg-steam-lightblue transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}