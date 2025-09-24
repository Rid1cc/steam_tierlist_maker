interface ImportTypeSelectorProps {
  importType: 'standard' | 'family'
  onTypeChange: (type: 'standard' | 'family') => void
}

export default function ImportTypeSelector({ importType, onTypeChange }: ImportTypeSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">Import Method</h3>
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            value="standard"
            checked={importType === 'standard'}
            onChange={(e) => onTypeChange(e.target.value as 'standard' | 'family')}
            className="w-4 h-4 text-steam-blue bg-steam-darkblue border-steam-lightblue focus:ring-steam-blue"
          />
          <div>
            <span className="text-white font-medium">Standard</span>
            <p className="text-sm text-gray-400">User library only (requires Steam ID)</p>
          </div>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            value="family"
            checked={importType === 'family'}
            onChange={(e) => onTypeChange(e.target.value as 'standard' | 'family')}
            className="w-4 h-4 text-steam-blue bg-steam-darkblue border-steam-lightblue focus:ring-steam-blue"
          />
          <div>
            <span className="text-white font-medium">Family Sharing</span>
            <p className="text-sm text-gray-400">User library + family shared games (requires webapi_token)</p>
          </div>
        </label>
      </div>
    </div>
  )
}