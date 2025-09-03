import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import type { Advocate } from '@/types'

// Mock advocate data for testing
export const mockAdvocates: Advocate[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    city: 'New York',
    degree: 'MD',
    specialties: ['Anxiety', 'Depression'],
    yearsOfExperience: 10,
    phoneNumber: 5551234567,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    city: 'Los Angeles',
    degree: 'PhD',
    specialties: ['Trauma', 'PTSD'],
    yearsOfExperience: 8,
    phoneNumber: 5559876543,
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Johnson',
    city: 'Chicago',
    degree: 'LCSW',
    specialties: ['Substance Abuse', 'Family Therapy'],
    yearsOfExperience: 15,
    phoneNumber: 5555555555,
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Wilson',
    city: 'Miami',
    degree: 'MD',
    specialties: ['Bipolar', 'Medication Management'],
    yearsOfExperience: 12,
    phoneNumber: 5551111111,
  },
]

// Custom render function with default props
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

// Mock fetch responses
export const createMockFetchResponse = (data: any, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
})

// Helper to mock successful API response
export const mockSuccessfulApiResponse = (data: Advocate[]) => {
  const mockFetch = jest.fn().mockResolvedValue(
    createMockFetchResponse({ data })
  )
  global.fetch = mockFetch
  return mockFetch
}

// Helper to mock API error response
export const mockApiErrorResponse = (error = 'API Error', status = 500) => {
  const mockFetch = jest.fn().mockResolvedValue(
    createMockFetchResponse({ error }, false, status)
  )
  global.fetch = mockFetch
  return mockFetch
}

// Helper to mock network error
export const mockNetworkError = (error = 'Network Error') => {
  const mockFetch = jest.fn().mockRejectedValue(new Error(error))
  global.fetch = mockFetch
  return mockFetch
}

// Wait for async operations
export const waitForAsyncOperations = () => 
  new Promise(resolve => setTimeout(resolve, 0))

// Search term splitting helper (matching the component logic)
export const getSearchTerms = (searchInput: string): string[] => {
  return searchInput.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0)
}

export * from '@testing-library/react'
export { customRender as render }