import { getSearchTerms, mockAdvocates } from '@/test-utils'
import type { Advocate } from '@/types'

describe('Search Functionality', () => {
  describe('getSearchTerms', () => {
    it('should split search input into lowercase terms', () => {
      const result = getSearchTerms('John MD')
      expect(result).toEqual(['john', 'md'])
    })

    it('should handle multiple spaces between terms', () => {
      const result = getSearchTerms('John    MD   Anxiety')
      expect(result).toEqual(['john', 'md', 'anxiety'])
    })

    it('should trim leading and trailing spaces', () => {
      const result = getSearchTerms('  John MD  ')
      expect(result).toEqual(['john', 'md'])
    })

    it('should return empty array for empty input', () => {
      const result = getSearchTerms('')
      expect(result).toEqual([])
    })

    it('should return empty array for whitespace only input', () => {
      const result = getSearchTerms('   ')
      expect(result).toEqual([])
    })

    it('should handle single term', () => {
      const result = getSearchTerms('anxiety')
      expect(result).toEqual(['anxiety'])
    })
  })

  describe('Multi-term search filtering', () => {
    const filterAdvocates = (advocates: Advocate[], searchTerms: string[]): Advocate[] => {
      return advocates.filter((advocate) => {
        const searchableText = [
          advocate.firstName.toLowerCase(),
          advocate.lastName.toLowerCase(),
          advocate.city.toLowerCase(),
          advocate.degree.toLowerCase(),
          ...advocate.specialties.map(s => s.toLowerCase()),
          advocate.yearsOfExperience.toString(),
          advocate.phoneNumber.toString()
        ].join(' ')

        return searchTerms.every(searchTerm => searchableText.includes(searchTerm))
      })
    }

    it('should find advocates by first name and degree', () => {
      const searchTerms = getSearchTerms('john md')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].firstName).toBe('John')
      expect(result[0].degree).toBe('MD')
    })

    it('should find advocates by specialty and city', () => {
      const searchTerms = getSearchTerms('anxiety new')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].firstName).toBe('John')
      expect(result[0].city).toBe('New York')
      expect(result[0].specialties).toContain('Anxiety')
    })

    it('should find advocates by years of experience', () => {
      const searchTerms = getSearchTerms('10')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].yearsOfExperience).toBe(10)
    })

    it('should find advocates by phone number', () => {
      const searchTerms = getSearchTerms('5551234567')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].phoneNumber).toBe(5551234567)
    })

    it('should find advocates by partial phone number', () => {
      const searchTerms = getSearchTerms('555123')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].phoneNumber).toBe(5551234567)
    })

    it('should require all terms to match (AND logic)', () => {
      const searchTerms = getSearchTerms('john ptsd') // John doesn't have PTSD specialty
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(0)
    })

    it('should be case insensitive', () => {
      const searchTerms = getSearchTerms('JOHN MD')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].firstName).toBe('John')
    })

    it('should handle complex multi-term searches', () => {
      const searchTerms = getSearchTerms('michael substance family')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].firstName).toBe('Michael')
      expect(result[0].specialties).toContain('Substance Abuse')
      expect(result[0].specialties).toContain('Family Therapy')
    })

    it('should return empty array when no matches found', () => {
      const searchTerms = getSearchTerms('nonexistent specialty')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(0)
    })

    it('should return all advocates for empty search terms', () => {
      const searchTerms = getSearchTerms('')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(mockAdvocates.length)
    })

    it('should handle partial matches in specialties', () => {
      const searchTerms = getSearchTerms('trauma')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].specialties).toContain('Trauma')
    })

    it('should handle searches across different field types', () => {
      const searchTerms = getSearchTerms('sarah 12 miami bipolar')
      const result = filterAdvocates(mockAdvocates, searchTerms)
      
      expect(result).toHaveLength(1)
      expect(result[0].firstName).toBe('Sarah')
      expect(result[0].yearsOfExperience).toBe(12)
      expect(result[0].city).toBe('Miami')
      expect(result[0].specialties).toContain('Bipolar')
    })
  })
})