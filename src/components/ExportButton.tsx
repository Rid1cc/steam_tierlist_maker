import html2canvas from 'html2canvas'

interface ExportButtonProps {
  tierListRef: React.RefObject<HTMLDivElement | null>
}

export default function ExportButton({ tierListRef }: ExportButtonProps) {
  const handleExport = async () => {
    if (!tierListRef.current) return

    try {
      // Show loading state
      const button = document.getElementById('export-btn')
      if (button) {
        button.textContent = 'Exporting...'
        button.setAttribute('disabled', 'true')
      }

            // Use html2canvas with minimal options to avoid artifacts
      const canvas = await html2canvas(tierListRef.current, {
        useCORS: true,
        allowTaint: false,
        logging: false
      })

      // Create download link
      const link = document.createElement('a')
      link.download = `steam-tierlist-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log('Tier list exported successfully!')
    } catch (error) {
      console.error('Error exporting tier list:', error)
      alert('Failed to export tier list. Please try again.')
    } finally {
      // Reset button state
      const button = document.getElementById('export-btn')
      if (button) {
        button.textContent = 'Export as Image'
        button.removeAttribute('disabled')
      }
    }
  }

  return (
    <button
      id="export-btn"
      onClick={handleExport}
      className="bg-steam-blue hover:bg-steam-lightblue text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export as Image
    </button>
  )
}