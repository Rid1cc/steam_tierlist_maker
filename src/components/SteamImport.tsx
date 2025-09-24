import { useState } from 'react'
import { useSteamApi, extractSteamId } from '@/hooks/useSteamApi'
import { Game } from '@/types/game'
import ImportTypeSelector from './ImportTypeSelector'
import GamePreviewList from './GamePreviewList'

interface SteamImportProps {
  onGamesImported: (games: Game[]) => void
  onClose: () => void
}

export default function SteamImport({ onGamesImported, onClose }: SteamImportProps) {
  const [steamInput, setSteamInput] = useState('')
  const [webApiToken, setWebApiToken] = useState('')
  const [importType, setImportType] = useState<'standard' | 'family'>('standard')
  const { loading, error, user, games, fetchUserGames, fetchFamilyGames, clearError } = useSteamApi()

  const handleImport = async () => {
    if (importType === 'family') {
      if (!webApiToken.trim()) {
        alert('Please enter your webapi_token from Steam')
        return
      }
      await fetchFamilyGames(webApiToken)
    } else {
      const steamId = extractSteamId(steamInput)
      if (!steamId) {
        alert('Please enter a valid Steam ID or profile URL')
        return
      }
      await fetchUserGames(steamId)
    }
  }

  const handleConfirmImport = () => {
    onGamesImported(games)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card-steam p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Import Steam Games</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <ImportTypeSelector 
          importType={importType}
          onTypeChange={setImportType}
        />

        {/* Standard Import */}
        {importType === 'standard' && (
          <div className="mb-6">
            <label className="block text-white mb-2">
              Steam Profile URL or Steam ID:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={steamInput}
                onChange={(e) => setSteamInput(e.target.value)}
                placeholder="https://steamcommunity.com/profiles/76561198... or Steam ID"
                className="flex-1 px-4 py-2 bg-steam-darkblue text-white rounded border border-steam-lightblue focus:border-steam-green outline-none"
                disabled={loading}
              />
              <button
                onClick={handleImport}
                disabled={loading || !steamInput.trim()}
                className="btn-steam min-w-[100px]"
              >
                {loading ? 'Loading...' : 'Import'}
              </button>
            </div>
          </div>
        )}

        {/* Family Sharing Import */}
        {importType === 'family' && (
          <div className="mb-6">
            <label className="block text-white mb-2">
              Steam Web API Token:
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={webApiToken}
                onChange={(e) => setWebApiToken(e.target.value)}
                placeholder="Your webapi_token from Steam"
                className="flex-1 px-4 py-2 bg-steam-darkblue text-white rounded border border-steam-lightblue focus:border-steam-green outline-none"
                disabled={loading}
              />
              <button
                onClick={handleImport}
                disabled={loading || !webApiToken.trim()}
                className="btn-steam min-w-[100px]"
              >
                {loading ? 'Loading...' : 'Import'}
              </button>
            </div>
            <div className="mt-3 p-3 bg-blue-900 bg-opacity-50 border border-blue-600 rounded text-blue-200 text-sm">
              <p className="font-bold mb-2">How to get your webapi_token:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Log into Steam in your browser</li>
                <li>Go to: <code className="bg-blue-800 px-1 rounded">store.steampowered.com/pointssummary/ajaxgetasyncconfig</code></li>
                <li>Copy the <code className="bg-blue-800 px-1 rounded">webapi_token</code> value</li>
                <li>Paste it above</li>
              </ol>
              <p/>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-900 bg-opacity-50 border border-red-600 rounded text-red-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <span className="font-medium">
                  {error.includes('Rate limit exceeded') ? '⏱️ Rate Limited' : '❌ Error'}
                </span>
                <p className="text-sm mt-1">{error}</p>
                {error.includes('Rate limit exceeded') && (
                  <p className="text-xs mt-2 text-red-300">
                    💡 Try again in a few minutes. We respect Steam&apos;s API rate limits.
                  </p>
                )}
                {error.includes('Invalid or expired web API token') && (
                  <p className="text-xs mt-2 text-red-300">
                    💡 Get a fresh token from Steam: <br/>
                    1. Visit store.steampowered.com (logged in)<br/>
                    2. Go to: store.steampowered.com/pointssummary/ajaxgetasyncconfig<br/>
                    3. Copy the &quot;webapi_token&quot; value
                  </p>
                )}
              </div>
              <button
                onClick={clearError}
                className="text-red-300 hover:text-red-100 ml-2 flex-shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="mb-6 p-4 bg-steam-blue bg-opacity-50 rounded border border-steam-lightblue">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 rounded"
              />
              <div>
                <h3 className="text-white font-bold text-lg">{user.username}</h3>
                {user.realName && (
                  <p className="text-gray-300">{user.realName}</p>
                )}
                <p className="text-steam-green text-sm">
                  Profile is {user.isPublic ? 'Public' : 'Private'}
                </p>
              </div>
            </div>
          </div>
        )}

        <GamePreviewList 
          games={games}
          loading={loading}
          onImport={handleConfirmImport}
        />

        {/* Instructions */}
        {!user && !loading && games.length === 0 && (
          <div className="text-gray-300 text-sm">
            {importType === 'standard' ? (
              <>
                <h4 className="font-bold mb-2">Standard Import Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to your Steam profile</li>
                  <li>Copy the URL (e.g., steamcommunity.com/profiles/76561198...)</li>
                  <li>Paste it above and click Import</li>
                </ol>
                <p className="mt-3 text-yellow-400">
                  ⚠️ Your Steam profile must be set to Public for this to work.
                </p>
                <p className="mt-3 text-yellow-400">
                  ⚠️ This method includes only games user owns, not family shared games.
                </p>
              </>
            ) : (
              <>
                <div className="mt-3 space-y-2">
                  <p className="text-green-400">
                    ✅ This method includes ALL games (owned + family shared)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}