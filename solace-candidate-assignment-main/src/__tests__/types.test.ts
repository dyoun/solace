import type { 
  Advocate, 
  AdvocatesApiResponse, 
  ApiErrorResponse, 
  SearchFilters, 
  LoadingState 
} from '@/types'

describe('Type Definitions', () => {
  describe('Advocate', () => {
    it('should accept valid advocate object', () => {
      const advocate: Advocate = {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        city: 'New York',
        degree: 'MD',
        specialties: ['Anxiety', 'Depression'],
        yearsOfExperience: 10,
        phoneNumber: 5551234567,
        createdAt: '2023-01-01T00:00:00Z'
      }

      expect(advocate.firstName).toBe('John')
      expect(advocate.specialties).toEqual(['Anxiety', 'Depression'])
      expect(advocate.yearsOfExperience).toBe(10)
      expect(advocate.phoneNumber).toBe(5551234567)
    })

    it('should accept advocate without optional fields', () => {
      const advocate: Advocate = {
        firstName: 'John',
        lastName: 'Smith',
        city: 'New York',
        degree: 'MD',
        specialties: ['Anxiety', 'Depression'],
        yearsOfExperience: 10,
        phoneNumber: 5551234567
      }

      expect(advocate.firstName).toBe('John')
      expect(advocate.id).toBeUndefined()
      expect(advocate.createdAt).toBeUndefined()
    })

    it('should require all non-optional fields', () => {
      // TypeScript compilation test - this should not compile if fields are missing
      const createAdvocate = (data: Advocate) => data

      expect(() => {
        createAdvocate({
          firstName: 'John',
          lastName: 'Smith',
          city: 'New York',
          degree: 'MD',
          specialties: ['Anxiety'],
          yearsOfExperience: 10,
          phoneNumber: 5551234567
        })
      }).not.toThrow()
    })
  })

  describe('AdvocatesApiResponse', () => {
    it('should accept valid API response', () => {
      const response: AdvocatesApiResponse = {
        data: [
          {
            firstName: 'John',
            lastName: 'Smith',
            city: 'New York',
            degree: 'MD',
            specialties: ['Anxiety'],
            yearsOfExperience: 10,
            phoneNumber: 5551234567
          }
        ]
      }

      expect(Array.isArray(response.data)).toBe(true)
      expect(response.data).toHaveLength(1)
      expect(response.data[0].firstName).toBe('John')
    })

    it('should accept empty data array', () => {
      const response: AdvocatesApiResponse = {
        data: []
      }

      expect(response.data).toEqual([])
    })
  })

  describe('ApiErrorResponse', () => {
    it('should accept error response with required fields', () => {
      const errorResponse: ApiErrorResponse = {
        error: 'Something went wrong'
      }

      expect(errorResponse.error).toBe('Something went wrong')
    })

    it('should accept error response with all fields', () => {
      const errorResponse: ApiErrorResponse = {
        error: 'Database connection failed',
        status: 500,
        details: { code: 'DB_CONNECTION_ERROR' }
      }

      expect(errorResponse.error).toBe('Database connection failed')
      expect(errorResponse.status).toBe(500)
      expect(errorResponse.details).toEqual({ code: 'DB_CONNECTION_ERROR' })
    })
  })

  describe('SearchFilters', () => {
    it('should accept search filters with required field', () => {
      const filters: SearchFilters = {
        searchTerm: 'john md'
      }

      expect(filters.searchTerm).toBe('john md')
    })

    it('should accept search filters with all fields', () => {
      const filters: SearchFilters = {
        searchTerm: 'anxiety therapist',
        specialty: 'Anxiety',
        city: 'New York',
        minExperience: 5
      }

      expect(filters.searchTerm).toBe('anxiety therapist')
      expect(filters.specialty).toBe('Anxiety')
      expect(filters.city).toBe('New York')
      expect(filters.minExperience).toBe(5)
    })
  })

  describe('LoadingState', () => {
    it('should accept loading state with required fields', () => {
      const loadingState: LoadingState = {
        isLoading: true,
        error: null
      }

      expect(loadingState.isLoading).toBe(true)
      expect(loadingState.error).toBeNull()
    })

    it('should accept loading state with error', () => {
      const loadingState: LoadingState = {
        isLoading: false,
        error: 'Failed to load data',
        success: null
      }

      expect(loadingState.isLoading).toBe(false)
      expect(loadingState.error).toBe('Failed to load data')
      expect(loadingState.success).toBeNull()
    })

    it('should accept loading state with success message', () => {
      const loadingState: LoadingState = {
        isLoading: false,
        error: null,
        success: 'Data loaded successfully'
      }

      expect(loadingState.isLoading).toBe(false)
      expect(loadingState.error).toBeNull()
      expect(loadingState.success).toBe('Data loaded successfully')
    })
  })

  describe('Type Constraints', () => {
    it('should enforce correct data types', () => {
      // Test that TypeScript catches type errors at compile time
      const advocate: Advocate = {
        firstName: 'John',
        lastName: 'Smith',
        city: 'New York',
        degree: 'MD',
        specialties: ['Anxiety', 'Depression'],
        yearsOfExperience: 10, // Must be number
        phoneNumber: 5551234567 // Must be number
      }

      expect(typeof advocate.yearsOfExperience).toBe('number')
      expect(typeof advocate.phoneNumber).toBe('number')
      expect(Array.isArray(advocate.specialties)).toBe(true)
    })

    it('should ensure specialties is array of strings', () => {
      const advocate: Advocate = {
        firstName: 'John',
        lastName: 'Smith', 
        city: 'New York',
        degree: 'MD',
        specialties: ['Anxiety', 'Depression', 'PTSD'],
        yearsOfExperience: 10,
        phoneNumber: 5551234567
      }

      advocate.specialties.forEach(specialty => {
        expect(typeof specialty).toBe('string')
      })
    })
  })
})