const imageUrlCache: Record<string, string> = {}

// This utility function fetches a signed image URL from the backend and supports dynamic folders
export const fetchSignedImageUrl = async (
  imageName: string,
  folder: string
): Promise<string | null> => {
  const cacheKey = `${folder}/${imageName}`

  if (imageUrlCache[cacheKey]) {
    return imageUrlCache[cacheKey]
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://backendapi-3ms0.onrender.com/api/v1/2401'
    const response = await fetch(`${baseUrl}/file/get/${folder}/${imageName}`)

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
