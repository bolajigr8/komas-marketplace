export interface SearchSuggestion {
  text: string
  type: 'product' | 'category' | 'store'
}

export interface SearchSuggestionsResponse {
  data: SearchSuggestion[]
  error: string | null
}