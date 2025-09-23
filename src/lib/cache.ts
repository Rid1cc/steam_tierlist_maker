// Simple in-memory cache for Steam API responses
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>()
  
  set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    const now = Date.now()
    const expiresAt = now + (ttlMinutes * 60 * 1000)
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    })
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }
  
  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return false
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => this.cache.delete(key))
  }
  
  // Get cache stats
  getStats() {
    const entries: Array<{key: string, age: number, expiresIn: number}> = []
    const now = Date.now()
    
    this.cache.forEach((entry, key) => {
      entries.push({
        key,
        age: (now - entry.timestamp) / 1000 / 60, // minutes
        expiresIn: (entry.expiresAt - now) / 1000 / 60 // minutes
      })
    })
    
    return {
      size: this.cache.size,
      entries
    }
  }
}

// Global cache instance
export const steamCache = new SimpleCache()

// Cleanup expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    steamCache.cleanup()
  }, 10 * 60 * 1000)
}

// Rate limiting
interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>()
  
  // Check if request is allowed
  isAllowed(key: string, maxRequests: number = 10, windowMinutes: number = 1): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)
    
    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + (windowMinutes * 60 * 1000)
      })
      return true
    }
    
    if (entry.count >= maxRequests) {
      return false
    }
    
    entry.count++
    return true
  }
  
  getRemainingRequests(key: string, maxRequests: number = 10): number {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - entry.count)
  }
  
  getResetTime(key: string): number | null {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return null
    }
    return entry.resetTime
  }
}

export const rateLimiter = new RateLimiter()