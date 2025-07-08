const imageUrlCache: Record<string, string> = {}

// This utility function fetches a signed image URL from the backend and it Supports dynamic folders

export const fetchSignedImageUrl = async (
  imageName: string,
  folder: string
): Promise<string | null> => {
  const cacheKey = `${folder}/${imageName}`

  if (imageUrlCache[cacheKey]) {
    return imageUrlCache[cacheKey]
  }

  try {
    const response = await fetch(
      `https://backendapi-3ms0.onrender.com/api/v1/2401/file/get/${folder}/${imageName}`
    )

    if (!response.ok) throw new Error('Failed to fetch image URL')

    const json = await response.json()
    const url = json?.data?.trim()

    if (url) {
      imageUrlCache[cacheKey] = url
    }

    return url || null
  } catch (error) {
    console.error(`Error fetching image URL from ${folder}:`, error)
    return null
  }
}
