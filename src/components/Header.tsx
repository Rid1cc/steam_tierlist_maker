interface HeaderProps {
  onReset: () => void
  onImportSteam: () => void
}

export default function Header({ onReset, onImportSteam }: HeaderProps) {
  return (
    <header className="bg-steam-darkblue border-b-2 border-steam-lightblue">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Steam Tierlist Maker
            </h1>
            <p className="text-steam-green text-lg">
              Classify your Steam games into tiers
            </p>
          </div>
          <div className="flex gap-4">
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