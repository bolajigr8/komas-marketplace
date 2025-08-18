// const imageUrlCache: Record<string, string> = {}

// // This utility function fetches a signed image URL from the backend and supports dynamic folders
// export const fetchSignedImageUrl = async (
//   imageName: string,
//   folder: string
// ): Promise<string | null> => {
//   const cacheKey = `${folder}/${imageName}`

//   if (imageUrlCache[cacheKey]) {
//     return imageUrlCache[cacheKey]
//   }

//   try {
//     const baseUrl =
//       process.env.NEXT_PUBLIC_API_URL ||
//       'https://backendapi-3ms0.onrender.com/api/v1/2401'
//     const response = await fetch(`${baseUrl}/file/get/${folder}/${imageName}`)

//     if (!response.ok) throw new Error('Failed to fetch image URL')

//     const json = await response.json()
//     const url = json?.data?.trim()

//     if (url) {
//       imageUrlCache[cacheKey] = url
//     }

//     return url || null
//   } catch (error) {
//     console.error(`Error fetching image URL from ${folder}:`, error)
//     return null
//   }
// }

interface ImageUrlResponse {
  data: string
}

interface BatchImageRequest {
  imageName: string
  folder: string
}

interface BatchImageResponse {
  [key: string]: string | null
}

class ImageUrlManager {
  private cache: Record<string, string> = {}
  private pendingRequests: Record<string, Promise<string | null>> = {}
  private batchQueue: Map<string, BatchImageRequest[]> = new Map()
  private batchTimeout: NodeJS.Timeout | null = null
  private readonly BATCH_SIZE = 10
  private readonly BATCH_DELAY = 50 // ms
  private readonly CACHE_EXPIRY = 30 * 60 * 1000 // 30 minutes
  private cacheTimestamps: Record<string, number> = {}

  private getBaseUrl(): string {
    console.log('env for the images', process.env.NEXT_PUBLIC_API_URL)
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      'https://backendapi-prod.onrender.com/api/v1/2401'
    )
  }

  private getCacheKey(folder: string, imageName: string): string {
    return `${folder}/${imageName}`
  }

  private isCacheValid(cacheKey: string): boolean {
    const timestamp = this.cacheTimestamps[cacheKey]
    if (!timestamp) return false
    return Date.now() - timestamp < this.CACHE_EXPIRY
  }

  // Single image fetch with deduplication
  async fetchSignedImageUrl(
    imageName: string,
    folder: string
  ): Promise<string | null> {
    const cacheKey = this.getCacheKey(folder, imageName)

    // Return cached result if valid
    if (this.cache[cacheKey] && this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey]
    }

    // Return pending request if already in progress
    if (cacheKey in this.pendingRequests) {
      return this.pendingRequests[cacheKey]
    }

    // Create new request
    const request = this.fetchSingleImage(imageName, folder)
    this.pendingRequests[cacheKey] = request

    try {
      const result = await request
      return result
    } finally {
      delete this.pendingRequests[cacheKey]
    }
  }

  private async fetchSingleImage(
    imageName: string,
    folder: string
  ): Promise<string | null> {
    const cacheKey = this.getCacheKey(folder, imageName)

    try {
      const baseUrl = this.getBaseUrl()
      const response = await fetch(
        `${baseUrl}/file/get/${folder}/${imageName}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const json: ImageUrlResponse = await response.json()
      const url = json?.data?.trim()

      if (url) {
        this.cache[cacheKey] = url
        this.cacheTimestamps[cacheKey] = Date.now()
        return url
      }

      return null
    } catch (error) {
      console.error(`Error fetching image URL for ${cacheKey}:`, error)
      return null
    }
  }

  // Batch fetch multiple images efficiently
  async fetchMultipleImages(
    requests: BatchImageRequest[]
  ): Promise<Record<string, string | null>> {
    const results: Record<string, string | null> = {}
    const uncachedRequests: BatchImageRequest[] = []

    // Check cache first
    for (const request of requests) {
      const cacheKey = this.getCacheKey(request.folder, request.imageName)
      if (this.cache[cacheKey] && this.isCacheValid(cacheKey)) {
        results[cacheKey] = this.cache[cacheKey]
      } else {
        uncachedRequests.push(request)
      }
    }

    if (uncachedRequests.length === 0) {
      return results
    }

    // Process uncached requests in batches
    const batches = this.chunkArray(uncachedRequests, this.BATCH_SIZE)
    const batchPromises = batches.map((batch) => this.processBatch(batch))

    try {
      const batchResults = await Promise.allSettled(batchPromises)

      // Merge all batch results
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          Object.assign(results, result.value)
        }
      })
    } catch (error) {
      console.error('Error in batch processing:', error)
    }

    return results
  }

  private async processBatch(
    batch: BatchImageRequest[]
  ): Promise<Record<string, string | null>> {
    const promises = batch.map((request) =>
      this.fetchSignedImageUrl(request.imageName, request.folder).then(
        (url) => ({
          key: this.getCacheKey(request.folder, request.imageName),
          url,
        })
      )
    )

    const results = await Promise.allSettled(promises)
    const batchResults: Record<string, string | null> = {}

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        batchResults[result.value.key] = result.value.url
      }
    })

    return batchResults
  }

  // Preload images for better UX
  async preloadImages(requests: BatchImageRequest[]): Promise<void> {
    // Fire and forget - don't wait for results
    this.fetchMultipleImages(requests).catch((error) => {
      console.error('Preload error:', error)
    })
  }

  // Queue-based batch processing for automatic batching
  queueImageFetch(imageName: string, folder: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const cacheKey = this.getCacheKey(folder, imageName)

      // Check cache immediately
      if (this.cache[cacheKey] && this.isCacheValid(cacheKey)) {
        resolve(this.cache[cacheKey])
        return
      }

      // Add to queue
      const folderQueue = this.batchQueue.get(folder) || []
      folderQueue.push({ imageName, folder })
      this.batchQueue.set(folder, folderQueue)

      // Set up batch processing
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout)
      }

      this.batchTimeout = setTimeout(() => {
        this.processBatchQueue()
          .then(() => {
            const url = this.cache[cacheKey]
            resolve(url || null)
          })
          .catch(reject)
      }, this.BATCH_DELAY)
    })
  }

  private async processBatchQueue(): Promise<void> {
    const allRequests: BatchImageRequest[] = []

    // Fixed: Use Array.from() to properly iterate over Map.entries()
    for (const [folder, requests] of Array.from(this.batchQueue.entries())) {
      allRequests.push(...requests)
    }

    // Clear the queue
    this.batchQueue.clear()
    this.batchTimeout = null

    if (allRequests.length > 0) {
      await this.fetchMultipleImages(allRequests)
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  // Cache management
  clearCache(): void {
    this.cache = {}
    this.cacheTimestamps = {}
  }

  getCacheSize(): number {
    return Object.keys(this.cache).length
  }

  // Clean expired entries
  cleanupExpiredCache(): void {
    const now = Date.now()
    const expiredKeys = Object.keys(this.cacheTimestamps).filter(
      (key) => now - this.cacheTimestamps[key] > this.CACHE_EXPIRY
    )

    expiredKeys.forEach((key) => {
      delete this.cache[key]
      delete this.cacheTimestamps[key]
    })
  }
}

// Create singleton instance
const imageUrlManager = new ImageUrlManager()

// Export the main functions
export const fetchSignedImageUrl = (
  imageName: string,
  folder: string
): Promise<string | null> => {
  return imageUrlManager.fetchSignedImageUrl(imageName, folder)
}

export const fetchMultipleSignedImageUrls = (
  requests: BatchImageRequest[]
): Promise<Record<string, string | null>> => {
  return imageUrlManager.fetchMultipleImages(requests)
}

export const preloadImages = (requests: BatchImageRequest[]): Promise<void> => {
  return imageUrlManager.preloadImages(requests)
}

export const queueImageFetch = (
  imageName: string,
  folder: string
): Promise<string | null> => {
  return imageUrlManager.queueImageFetch(imageName, folder)
}

export const clearImageCache = (): void => {
  imageUrlManager.clearCache()
}

export const getImageCacheSize = (): number => {
  return imageUrlManager.getCacheSize()
}

// Utility: Clean cache periodically (call this in your app initialization)
export const startCacheCleanup = (
  intervalMs: number = 10 * 60 * 1000
): void => {
  setInterval(() => {
    imageUrlManager.cleanupExpiredCache()
  }, intervalMs)
}
