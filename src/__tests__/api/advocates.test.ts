/**
 * @jest-environment node
 */

import { GET } from '@/app/api/advocates/route'

describe('/api/advocates', () => {
  describe('GET', () => {
    it('should return advocate data successfully', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('data')
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeGreaterThan(0)
    })

    it('should return correct advocate structure', async () => {
      const response = await GET()
      const data = await response.json()

      const advocate = data.data[0]
      expect(advocate).toHaveProperty('firstName')
      expect(advocate).toHaveProperty('lastName')
      expect(advocate).toHaveProperty('city')
      expect(advocate).toHaveProperty('degree')
      expect(advocate).toHaveProperty('specialties')
      expect(advocate).toHaveProperty('yearsOfExperience')
      expect(advocate).toHaveProperty('phoneNumber')
    })

    it('should return advocates with correct data types', async () => {
      const response = await GET()
      const data = await response.json()

      const advocate = data.data[0]
      expect(typeof advocate.firstName).toBe('string')
      expect(typeof advocate.lastName).toBe('string')
      expect(typeof advocate.city).toBe('string')
      expect(typeof advocate.degree).toBe('string')
      expect(Array.isArray(advocate.specialties)).toBe(true)
      expect(typeof advocate.yearsOfExperience).toBe('number')
      expect(typeof advocate.phoneNumber).toBe('number')
    })

    it('should have specialties as array of strings', async () => {
      const response = await GET()
      const data = await response.json()

      const advocate = data.data[0]
      expect(Array.isArray(advocate.specialties)).toBe(true)
      advocate.specialties.forEach((specialty: any) => {
        expect(typeof specialty).toBe('string')
      })
    })

    it('should return content-type application/json', async () => {
      const response = await GET()
      const contentType = response.headers.get('content-type')
      
      expect(contentType).toContain('application/json')
    })

    it('should return advocates with expected properties', async () => {
      const response = await GET()
      const data = await response.json()

      // Check first advocate has expected structure
      const firstAdvocate = data.data[0]
      expect(typeof firstAdvocate.firstName).toBe('string')
      expect(typeof firstAdvocate.lastName).toBe('string')
      expect(typeof firstAdvocate.city).toBe('string')
      expect(typeof firstAdvocate.degree).toBe('string')
      expect(Array.isArray(firstAdvocate.specialties)).toBe(true)
      expect(typeof firstAdvocate.yearsOfExperience).toBe('number')
      expect(typeof firstAdvocate.phoneNumber).toBe('number')
    })
  })

})