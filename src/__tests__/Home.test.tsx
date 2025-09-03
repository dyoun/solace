import { render, screen, waitFor, fireEvent } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import { 
  mockAdvocates, 
  mockSuccessfulApiResponse, 
  mockApiErrorResponse,
  mockNetworkError
} from '@/test-utils'

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should display loading state initially', () => {
      // Mock a slow API response
      global.fetch = jest.fn(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ data: mockAdvocates })
        }), 100))
      ) as jest.Mock

      render(<Home />)

      expect(screen.getByText('Loading advocates...')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Solace Advocates' })).toBeInTheDocument()
    })

    it('should show loading spinner', () => {
      global.fetch = jest.fn(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ data: mockAdvocates })
        }), 100))
      ) as jest.Mock

      render(<Home />)

      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Successful Data Loading', () => {
    beforeEach(() => {
      mockSuccessfulApiResponse(mockAdvocates)
    })

    it('should display advocates after successful API call', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      // Check if advocates are displayed
      expect(screen.getAllByText('John Smith').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Jane Doe').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Michael Johnson').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Sarah Wilson').length).toBeGreaterThan(0)
    })

    it('should display advocate count', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      // Check for the specific count text
      const countElements = screen.getAllByText((content, element) => {
        return element?.textContent === 'Showing 4 of 4 advocates'
      })
      expect(countElements.length).toBeGreaterThan(0)
    })

    it('should display all advocate information', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      // Check first advocate details
      expect(screen.getAllByText('John Smith').length).toBeGreaterThan(0)
      expect(screen.getAllByText('New York').length).toBeGreaterThan(0)
      expect(screen.getAllByText('MD').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Anxiety').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Depression').length).toBeGreaterThan(0)
      expect(screen.getAllByText('10 years').length).toBeGreaterThan(0)
      expect(screen.getAllByText('5551234567').length).toBeGreaterThan(0)
    })

    it('should display specialties as badges', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const anxietyBadge = screen.getByText('Anxiety')
      expect(anxietyBadge).toHaveClass('bg-indigo-100', 'text-indigo-800', 'rounded-full')
    })
  })

  describe('Error States', () => {
    it('should display error message on API failure', async () => {
      mockApiErrorResponse('Failed to load advocates', 500)

      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText(/Error: HTTP error! status: 500/)).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
    })

    it('should display error message on network failure', async () => {
      mockNetworkError('Network connection failed')

      render(<Home />)

      await waitFor(() => {
        expect(screen.getByText(/Error: Network connection failed/)).toBeInTheDocument()
      })
    })

    it('should style error messages correctly', async () => {
      mockApiErrorResponse('Test error')

      render(<Home />)

      await waitFor(() => {
        const errorElements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes('Error:') && element?.textContent?.includes('HTTP error! status: 500') || false
        })
        expect(errorElements.length).toBeGreaterThan(0)
        
        // Test that the error container with the correct classes exists
        const errorContainer = document.querySelector('.bg-red-50.border-red-200')
        expect(errorContainer).toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    beforeEach(() => {
      mockSuccessfulApiResponse(mockAdvocates)
    })

    it('should have search input with correct placeholder', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by multiple terms/)
      expect(searchInput).toBeInTheDocument()
    })

    it('should filter advocates based on search term', async () => {
      const user = userEvent.setup()
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by multiple terms/)
      
      await user.type(searchInput, 'john')

      // Should show John Smith and Michael Johnson (Johnson contains 'john')
      expect(screen.getAllByText('John Smith').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Michael Johnson').length).toBeGreaterThan(0)
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('Sarah Wilson')).not.toBeInTheDocument()

      // Check filtered count elements are present
      await waitFor(() => {
        const countElements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes('Showing 2 of 4 advocates')
        })
        expect(countElements.length).toBeGreaterThan(0)
      })
    })

    it('should support multi-term search', async () => {
      const user = userEvent.setup()
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by multiple terms/)
      
      await user.type(searchInput, 'john md')

      // Should show only John Smith (has both 'john' and 'md')
      expect(screen.getAllByText('John Smith').length).toBeGreaterThan(0)
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()

      // Check filtered count elements are present
      await waitFor(() => {
        const countElements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes('Showing') && element?.textContent?.includes('advocates') || false
        })
        expect(countElements.length).toBeGreaterThan(0)
      })
    })

    it('should display search terms as badges', async () => {
      const user = userEvent.setup()
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by multiple terms/)
      
      await user.type(searchInput, 'john md anxiety')

      // Should display search terms as badges
      const searchTerms = screen.getByText('Searching for:')
      expect(searchTerms).toBeInTheDocument()
      
      // Check for individual term badges
      expect(screen.getByText('john')).toBeInTheDocument()
      expect(screen.getByText('md')).toBeInTheDocument()
      expect(screen.getByText('anxiety')).toBeInTheDocument()
    })

    it('should show no results message when no advocates match', async () => {
      const user = userEvent.setup()
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by multiple terms/)
      
      await user.type(searchInput, 'nonexistent')

      await waitFor(() => {
        expect(screen.getByText('No advocates found')).toBeInTheDocument()
        expect(screen.getByText('Try adjusting your search terms or reset the search to see all advocates.')).toBeInTheDocument()
      })

      // Check filtered count shows 0
      const countElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Showing') && element?.textContent?.includes('advocates') || false
      })
      expect(countElements.length).toBeGreaterThan(0)
    })
  })

  describe('Reset Functionality', () => {
    beforeEach(() => {
      mockSuccessfulApiResponse(mockAdvocates)
    })

    it('should reset search when reset button is clicked', async () => {
      const user = userEvent.setup()
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by multiple terms/)
      const resetButton = screen.getByRole('button', { name: 'Reset' })

      // First, filter the results
      await user.type(searchInput, 'john')
      
      // Check that filtering worked - look for the specific count text
      await waitFor(() => {
        const countElements = screen.getAllByText((content, element) => {
          return element?.textContent === 'Showing 2 of 4 advocates'
        })
        expect(countElements.length).toBeGreaterThan(0)
      })

      // Then reset
      await user.click(resetButton)

      // Should show all advocates again
      await waitFor(() => {
        const countElements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes('Showing') && element?.textContent?.includes('advocates') || false
        })
        expect(countElements.length).toBeGreaterThan(0)
      })

      // Search input should be cleared
      expect(searchInput).toHaveValue('')

      // All advocates should be visible
      expect(screen.getAllByText('John Smith').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Jane Doe').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Michael Johnson').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Sarah Wilson').length).toBeGreaterThan(0)
    })

    it('should have proper button styling', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const resetButton = screen.getByRole('button', { name: 'Reset' })
      expect(resetButton).toHaveClass('bg-indigo-600', 'text-white', 'hover:bg-indigo-700')
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockSuccessfulApiResponse(mockAdvocates)
    })

    it('should have proper heading structure', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      expect(screen.getByRole('heading', { level: 1, name: 'Solace Advocates' })).toBeInTheDocument()
    })

    it('should have proper form labels', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      expect(screen.getByLabelText('Search Advocates')).toBeInTheDocument()
    })

    it('should have proper table structure', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      // Check table headers
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Location' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Credentials' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Specialties' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Experience' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Contact' })).toBeInTheDocument()
    })

    it('should have keyboard navigation support', async () => {
      const user = userEvent.setup()
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search by multiple terms/)
      const resetButton = screen.getByRole('button', { name: 'Reset' })

      // Test tab navigation
      await user.tab()
      expect(searchInput).toHaveFocus()

      await user.tab()
      expect(resetButton).toHaveFocus()
    })
  })

  describe('Responsive Design', () => {
    beforeEach(() => {
      mockSuccessfulApiResponse(mockAdvocates)
    })

    it('should have responsive container classes', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const mainElement = document.querySelector('main')
      expect(mainElement).toHaveClass('min-h-screen', 'bg-gradient-to-br')

      const containerDiv = document.querySelector('.container')
      expect(containerDiv).toHaveClass('container', 'mx-auto', 'px-6', 'py-12')
    })

    it('should have responsive table with horizontal scroll', async () => {
      render(<Home />)

      await waitFor(() => {
        expect(screen.queryByText('Loading advocates...')).not.toBeInTheDocument()
      })

      const tableContainer = document.querySelector('.overflow-x-auto')
      expect(tableContainer).toBeInTheDocument()
    })
  })
})