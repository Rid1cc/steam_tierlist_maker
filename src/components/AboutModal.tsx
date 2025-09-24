import { useState } from 'react'

interface AboutModalProps {
  onClose: () => void
}

export default function AboutModal({ onClose }: AboutModalProps) {
  const [showDataPolicy, setShowDataPolicy] = useState(false)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card-steam p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">About Steam Tierlist Maker</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDataPolicy(!showDataPolicy)}
                className="btn-steam px-3 py-1 text-xs"
              >
                {showDataPolicy ? 'Hide Policy' : 'Data Policy'}
              </button>
              
              <a
                href="https://github.com/Rid1cc/steam_tierlist_maker"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-steam px-3 py-1 text-xs flex items-center gap-1 hover:bg-steam-lightblue transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Data Policy Section */}
        {showDataPolicy && (
          <div className="p-4 bg-steam-darkblue bg-opacity-50 rounded border border-steam-lightblue mb-6">
            <h3 className="text-steam-green font-bold text-lg mb-3">Data Policy</h3>
            <div className="text-sm space-y-3 leading-relaxed text-gray-300">
              <p>
                <strong className="text-steam-green">Data Storage:</strong> All game data and tier list configurations are stored locally in your browser. 
                Your Steam Web API token (if provided for family sharing) is never stored or logged on our servers.
              </p>
              
              <p>
                <strong className="text-steam-green">Steam Integration:</strong> When you import games from Steam, we offer two methods: <br/>
                • <strong>Standard Import:</strong> Uses Steam&apos;s public Web API to fetch publicly visible game libraries. Your Steam profile must be set to public. <br/>
                • <strong>Family Sharing Import:</strong> Requires your personal Steam Web API token to access family shared games. This token provides authenticated access to your account data.
              </p>
              
              <p>
                <strong className="text-steam-green">Data Processing:</strong> Game images are loaded directly from Steam&apos;s CDN. 
                Tier list exports are generated locally in your browser using client-side processing.
              </p>
              
              <p>
                <strong className="text-steam-green">Data Retention:</strong> Your tier lists and settings persist in your browser&apos;s local storage until you clear them manually. 
                No data is retained on our servers.
              </p>
              
              <p>
                <strong className="text-steam-green">Third-Party Services:</strong> This application uses Steam Web API for game data and Cloudflare Pages for hosting. 
                Please refer to their respective privacy policies for more information.
              </p>
              
              <p>
                <strong className="text-steam-green">Your Rights:</strong> You can clear all locally stored data at any time by clearing your browser&apos;s local storage or resetting the tier list. 
                Your Steam Web API token is only used during import and is not persisted. No account registration is required to use this application.
              </p>

              <p>
                <strong className="text-steam-green">Steam Web API Compliance:</strong> This application uses Steam Web API in accordance with Valve&apos;s terms of use. 
                Your personal Web API token is kept confidential and used only as requested by you. Data retrieval follows Steam&apos;s rate limits and usage guidelines.
              </p>

              <p>
                <strong className="text-steam-green">Disclaimer:</strong> Steam data is provided &quot;as is&quot; without any warranties. 
                We make no representations regarding the accuracy, completeness, or reliability of Steam data. 
                Use of Steam data is at your own risk. Valve Corporation is not responsible for any issues arising from the use of this application.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6 text-gray-300">
          {/* Main description section */}
          <div className="p-4 bg-steam-darkblue bg-opacity-50 rounded border border-steam-lightblue">
            <h3 className="text-steam-green font-bold text-lg mb-3">What is Steam Tierlist Maker?</h3>
            <p className="text-sm leading-relaxed">
              Steam Tierlist Maker is a web application that allows you to create custom tier lists for your Steam games. 
              Import your Steam library and organize your games into different tiers based on your preferences.
            </p>
            <><br /></>
            <p className="text-sm leading-relaxed">
              Steam Tierlist Maker is a fan-made tool and is not affiliated with Valve Corporation.
              Steam and the Steam logo are trademarks and/or registered trademarks of Valve Corporation.
              Game images and other assets are property of their respective owners.

            </p>
          </div>

          {/* Features section */}
          <div className="p-4 bg-steam-darkblue bg-opacity-50 rounded border border-steam-lightblue">
            <h3 className="text-steam-green font-bold text-lg mb-3">Features</h3>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>Import games directly from your Steam profile</li>
              <li>Support for family shared games</li>
              <li>Drag & drop interface with sortable positioning</li>
              <li>Customizable tier colors and names</li>
              <li>Game library filtering and sorting</li>
              <li>Export your tierlist as image</li>
            </ul>
          </div>

          {/* How to use section */}
          <div className="p-4 bg-steam-darkblue bg-opacity-50 rounded border border-steam-lightblue">
            <h3 className="text-steam-green font-bold text-lg mb-3">How to Use</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Click &quot;Import Steam Games&quot; to load your Steam library</li>
              <li>Drag games from the library to different tiers</li>
              <li>Use the settings panel to customize tiers and colors</li>
              <li>Export your finished tierlist when ready</li>
            </ol>
          </div>

          {/* Technology section */}
          <div className="p-4 bg-steam-darkblue bg-opacity-50 rounded border border-steam-lightblue">
            <h3 className="text-steam-green font-bold text-lg mb-3">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-steam-green font-semibold">Frontend:</span>
                <ul className="ml-4 list-disc list-inside">
                  <li>Next.js 15</li>
                  <li>React 19</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <span className="text-steam-green font-semibold">Libraries:</span>
                <ul className="ml-4 list-disc list-inside">
                  <li>@dnd-kit for drag & drop</li>
                  <li>Steam Web API</li>
                  <li>Cloudflare Pages</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Developer section */}
          <div className="p-4 bg-steam-darkblue bg-opacity-50 rounded border border-steam-lightblue">
            <h3 className="text-steam-green font-bold text-lg mb-3">Credits :)</h3>
            <p className="text-sm">
              Created with ❤️ by{' '}
              <a 
                href="https://github.com/Rid1cc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ridicc-name relative inline-block font-semibold text-steam-green transition-all duration-300 cursor-pointer transform hover:scale-110"
              >
                Ridicc
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Open source project • {new Date().getFullYear()}
            </p>
          </div>

          {/* Footer note */}
          <div className="text-center text-xs text-gray-400 border-t border-steam-lightblue/20 pt-4">
            <p className="mt-1">This application is not affiliated with Valve Corporation</p>
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="btn-steam px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}