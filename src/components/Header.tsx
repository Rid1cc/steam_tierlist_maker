interface HeaderProps {
  onReset: () => void
  onImportSteam: () => void
  onAbout: () => void
}

// Main header component with animated logo and action buttons
export default function Header({ onReset, onImportSteam, onAbout }: HeaderProps) {
  return (
    <header className="bg-steam-darkblue border-b-2 border-steam-lightblue">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Shuffling Cards Logo */}
            <div className="relative w-16 h-16 group cursor-pointer">
              {/* Back card - Red (S tier) */}
              <div className="absolute w-14 h-14 bg-[#ff7f80] rounded-lg shadow-lg transition-all duration-500 ease-in-out group-hover:translate-x-6 group-hover:-translate-y-2 group-hover:rotate-12 group-hover:scale-110"></div>
              
              {/* Middle card - Yellow (B tier) */}
              <div className="absolute w-14 h-14 bg-[#ffdf80] rounded-lg shadow-lg top-1 left-1 transition-all duration-500 ease-in-out delay-75 group-hover:-translate-x-4 group-hover:-translate-y-1 group-hover:-rotate-6 group-hover:scale-105"></div>

              {/* Front card - Green (A tier) */}
              <div className="absolute w-14 h-14 bg-[#4ade80] rounded-lg shadow-lg top-2 left-2 transition-all duration-500 ease-in-out delay-150 group-hover:translate-x-2 group-hover:translate-y-3 group-hover:rotate-3 group-hover:scale-105"></div>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Steam Tierlist Maker
              </h1>
              <p className="text-steam-green text-lg">
                Classify your Steam games into tiers
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onAbout}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              About
            </button>
            <button
              onClick={onImportSteam}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Import Steam Games
            </button>
            <button
              onClick={onReset}
              className="btn-steam"
            >
              Reset Tierlist
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}