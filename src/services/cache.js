/**
 * Database Egress Cache Service
 * Implements hybrid storage (memory + localStorage) with stale-while-revalidate pattern
 */

const CACHE_PREFIX = 'db_cache:';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes - data is fresh
const EXPIRED_TIME = 60 * 60 * 1000; // 1 hour - data is stale but usable
const MAX_CACHE_SIZE = 9 * 1024 * 1024; // 9MB (leave 1MB buffer for localStorage)

class DatabaseCache {
  constructor() {
    this.memoryCache = new Map();
    this.pendingRequests = new Map(); // Track ongoing requests to prevent duplicate fetches
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0
    };
    this.init();
  }

  /**
   * Check if localStorage is available
   */
  isLocalStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Initialize cache - load from localStorage and clean expired entries
   */
  init() {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage not available, using memory cache only');
      return;
    }
    
    try {
      this.loadFromLocalStorage();
      this.cleanExpiredEntries();
    } catch (error) {
      console.warn('Cache initialization error:', error);
      this.stats.errors++;
    }
  }

  /**
   * Generate cache key from query type and parameters
   */
  generateKey(queryType, params = null) {
    const paramsStr = params !== null ? JSON.stringify(params) : 'null';
    return `${CACHE_PREFIX}${queryType}:${paramsStr}`;
  }

  /**
   * Synchronously get cache entry if available (for immediate rendering)
   * Returns data immediately if in cache, null otherwise
   */
  getSync(key) {
    return this.get(key);
  }

  /**
   * Get cache entry from memory or localStorage (synchronous)
   */
  get(key) {
    // Check memory cache first (fastest)
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      if (this.isValid(entry)) {
        this.stats.hits++;
        if (process.env.NODE_ENV === 'development') {
          console.log('[Cache] HIT (memory) for key:', key);
        }
        return entry.data;
      } else {
        // Remove expired entry from memory
        this.memoryCache.delete(key);
      }
    }

    // Check localStorage
    if (this.isLocalStorageAvailable()) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const entry = JSON.parse(stored);
          if (this.isValid(entry)) {
            // Restore to memory cache
            this.memoryCache.set(key, entry);
            this.stats.hits++;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Cache] HIT (localStorage) for key:', key);
            }
            return entry.data;
          } else {
            // Remove expired entry
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn('Error reading from localStorage:', error);
        this.stats.errors++;
        // Remove corrupted entry
        try {
          localStorage.removeItem(key);
        } catch (e) {
          // Ignore removal errors
        }
      }
    }

    this.stats.misses++;
    if (process.env.NODE_ENV === 'development') {
      console.log('[Cache] MISS for key:', key);
    }
    return null;
  }

  /**
   * Synchronously check if cache has valid data (for immediate rendering)
   */
  has(key) {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      return this.isValid(entry);
    }

    // Check localStorage
    if (this.isLocalStorageAvailable()) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const entry = JSON.parse(stored);
          if (this.isValid(entry)) {
            // Restore to memory cache for faster future access
            this.memoryCache.set(key, entry);
            return true;
          }
        }
      } catch (error) {
        // Ignore errors in has check
      }
    }

    return false;
  }

  /**
   * Check if cache entry is valid (not expired)
   */
  isValid(entry) {
    if (!entry || !entry.timestamp) return false;
    const age = Date.now() - entry.timestamp;
    return age < EXPIRED_TIME;
  }

  /**
   * Check if cache entry is stale (needs refresh but still usable)
   */
  isStale(entry) {
    if (!entry || !entry.timestamp) return true;
    const age = Date.now() - entry.timestamp;
    return age >= STALE_TIME && age < EXPIRED_TIME;
  }

  /**
   * Set cache entry in both memory and localStorage
   */
  set(key, data) {
    const entry = {
      data,
      timestamp: Date.now()
    };

    // Always store in memory (fastest)
    this.memoryCache.set(key, entry);
    
    // Debug: Log cache set
    if (process.env.NODE_ENV === 'development') {
      console.log('[Cache] Setting cache for key:', key, 'Data length:', Array.isArray(data) ? data.length : 'N/A');
    }

    // Store in localStorage if available
    if (!this.isLocalStorageAvailable()) {
      return; // Memory cache only
    }

    try {
      const serialized = JSON.stringify(entry);
      const size = new Blob([serialized]).size;

      // Check if we're approaching localStorage limit
      if (this.getLocalStorageSize() + size > MAX_CACHE_SIZE) {
        // Clean oldest entries first
        this.evictOldestEntries(size);
      }

      localStorage.setItem(key, serialized);
    } catch (error) {
      // Handle quota exceeded or other errors
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn('localStorage quota exceeded, evicting old entries');
        try {
          const serialized = JSON.stringify(entry);
          const size = new Blob([serialized]).size;
          this.evictOldestEntries(size);
          localStorage.setItem(key, serialized);
        } catch (retryError) {
          console.warn('Failed to store in localStorage after eviction:', retryError);
          this.stats.errors++;
          // Still keep in memory cache
        }
      } else {
        console.warn('Error storing in localStorage:', error);
        this.stats.errors++;
      }
    }
  }

  /**
   * Get total size of localStorage cache
   */
  getLocalStorageSize() {
    if (!this.isLocalStorageAvailable()) {
      return 0;
    }
    
    let total = 0;
    try {
      for (let key in localStorage) {
        if (key.startsWith(CACHE_PREFIX)) {
          total += new Blob([localStorage.getItem(key)]).size;
        }
      }
    } catch (error) {
      console.warn('Error calculating localStorage size:', error);
    }
    return total;
  }

  /**
   * Evict oldest cache entries to make room
   */
  evictOldestEntries(requiredSpace) {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    
    const entries = [];
    
    try {
      // Collect all cache entries with timestamps
      for (let key in localStorage) {
        if (key.startsWith(CACHE_PREFIX)) {
          try {
            const entry = JSON.parse(localStorage.getItem(key));
            entries.push({ key, timestamp: entry.timestamp });
          } catch (e) {
            // Remove corrupted entries
            localStorage.removeItem(key);
          }
        }
      }

      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);

      // Remove oldest entries until we have enough space
      let freed = 0;
      for (const entry of entries) {
        if (freed >= requiredSpace) break;
        
        const itemSize = new Blob([localStorage.getItem(entry.key)]).size;
        localStorage.removeItem(entry.key);
        this.memoryCache.delete(entry.key);
        freed += itemSize;
      }
    } catch (error) {
      console.warn('Error evicting cache entries:', error);
    }
  }

  /**
   * Load cache entries from localStorage to memory
   */
  loadFromLocalStorage() {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    
    try {
      for (let key in localStorage) {
        if (key.startsWith(CACHE_PREFIX)) {
          try {
            const entry = JSON.parse(localStorage.getItem(key));
            if (this.isValid(entry)) {
              this.memoryCache.set(key, entry);
            } else {
              // Remove expired entries
              localStorage.removeItem(key);
            }
          } catch (e) {
            // Remove corrupted entries
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }
  }

  /**
   * Clean expired entries from both memory and localStorage
   */
  cleanExpiredEntries() {
    const now = Date.now();
    
    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp >= EXPIRED_TIME) {
        this.memoryCache.delete(key);
      }
    }

    // Clean localStorage
    if (this.isLocalStorageAvailable()) {
      try {
        const keysToRemove = [];
        for (let key in localStorage) {
          if (key.startsWith(CACHE_PREFIX)) {
            try {
              const entry = JSON.parse(localStorage.getItem(key));
              if (now - entry.timestamp >= EXPIRED_TIME) {
                keysToRemove.push(key);
              }
            } catch (e) {
              // Mark corrupted entries for removal
              keysToRemove.push(key);
            }
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Error cleaning expired entries:', error);
      }
    }
  }

  /**
   * Stale-while-revalidate: Get cached data and fetch fresh data in background
   * Returns { data, fromCache } to indicate if data came from cache
   */
  async getOrFetch(key, fetchFn) {
    // Check if there's a pending request for this key
    if (this.pendingRequests.has(key)) {
      // Wait for the pending request to complete
      const result = await this.pendingRequests.get(key);
      return result;
    }

    // Get cached data synchronously
    const cached = this.get(key);
    
    // If we have valid cached data, return it immediately
    if (cached !== null) {
      // Get entry from memory or localStorage safely
      let entry = this.memoryCache.get(key);
      if (!entry && this.isLocalStorageAvailable()) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            entry = JSON.parse(stored);
          }
        } catch (error) {
          console.warn('Error reading cache entry:', error);
          // Continue without entry - will fetch fresh data
        }
      }
      
      // If data is stale, fetch fresh data in background
      if (entry && this.isStale(entry)) {
        // Don't await - fetch in background
        this.fetchAndUpdate(key, fetchFn).catch(error => {
          console.warn('Background fetch failed:', error);
        });
      }
      
      // Return immediately with cached data
      return cached;
    }

    // No cache hit - fetch fresh data
    return await this.fetchAndUpdate(key, fetchFn);
  }

  /**
   * Fetch data and update cache
   */
  async fetchAndUpdate(key, fetchFn) {
    // Create promise for this request
    const fetchPromise = (async () => {
      try {
        const data = await fetchFn();
        // Store in cache
        this.set(key, data);
        return data;
      } catch (error) {
        // If fetch fails and we have stale data, return stale data
        const stale = this.get(key);
        if (stale !== null) {
          console.warn('Fetch failed, returning stale cache:', error);
          return stale;
        }
        throw error;
      } finally {
        // Remove from pending requests
        this.pendingRequests.delete(key);
      }
    })();

    // Store promise to prevent duplicate requests
    this.pendingRequests.set(key, fetchPromise);
    
    return await fetchPromise;
  }

  /**
   * Clear all cache entries
   */
  clearCache() {
    this.memoryCache.clear();
    if (this.isLocalStorageAvailable()) {
      try {
        const keysToRemove = [];
        for (let key in localStorage) {
          if (key.startsWith(CACHE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Error clearing cache:', error);
      }
    }
    this.stats = { hits: 0, misses: 0, errors: 0 };
  }

  /**
   * Clear cache entries by query type
   */
  clearCacheByType(queryType) {
    const prefix = `${CACHE_PREFIX}${queryType}:`;
    
    // Clear from memory
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear from localStorage
    if (this.isLocalStorageAvailable()) {
      try {
        const keysToRemove = [];
        for (let key in localStorage) {
          if (key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Error clearing cache by type:', error);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const memorySize = this.memoryCache.size;
    const localStorageSize = this.getLocalStorageSize();
    
    return {
      memoryEntries: memorySize,
      localStorageSize: localStorageSize,
      localStorageSizeMB: (localStorageSize / (1024 * 1024)).toFixed(2),
      stats: { ...this.stats },
      hitRate: this.stats.hits + this.stats.misses > 0 
        ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2) + '%'
        : '0%'
    };
  }
}

// Export singleton instance
const cache = new DatabaseCache();

// Export functions for manual cache management
export const clearCache = () => cache.clearCache();
export const clearCacheByType = (queryType) => cache.clearCacheByType(queryType);
export const getCacheStats = () => cache.getCacheStats();

// Export cache instance for internal use
export default cache;

