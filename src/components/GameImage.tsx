import { useState } from 'react'

interface GameImageProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  fill?: boolean
  gameName: string
}

export default function GameImage({ src, alt, className = '', sizes, fill = false, gameName }: GameImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // If image failed to load, show text fallback
  if (imageError) {
    return (
      <div 
        className={`bg-steam-blue flex items-center justify-center text-white text-center p-2 ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : undefined}
      >
        <div className="text-xs font-medium leading-tight">
          {gameName.split(' ').slice(0, 3).join(' ')}
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div 
          className={`bg-steam-darkblue animate-pulse ${className}`}
          style={fill ? { position: 'absolute', inset: 0 } : undefined}
        />
      )}
      {src ? (
        <div
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          style={fill ? { 
            position: 'absolute', 
            inset: 0, 
            width: '100%',
            height: '100%',
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          } : { 
            width: '100%',
            height: '100%',
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{ opacity: 0, width: '100%', height: '100%' }}
            sizes={sizes}
            onError={handleError}
            onLoad={handleLoad}
            loading="lazy"
          />
        </div>
      ) : (
        <div 
          className={`bg-steam-blue flex items-center justify-center text-white text-center p-2 ${className}`}
          style={fill ? { position: 'absolute', inset: 0 } : undefined}
        >
          <div className="text-xs font-medium leading-tight">
            {gameName.split(' ').slice(0, 3).join(' ')}
          </div>
        </div>
      )}
    </>
  )
}