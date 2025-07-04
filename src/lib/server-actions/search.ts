
// import { api } from "@/lib/api"

// export const searchSuggestions = async (query: string) => {
//   try {
//     const response = await api.get(`/search/suggestions?query=${query}`) 
//     return {
//       data: response.data,
//       error: null
//     }
//   } catch (error) {
//     return {
//       data: [],
//       error: error instanceof Error ? error.message : 'Failed to fetch suggestions'
//     }
//   }
// }