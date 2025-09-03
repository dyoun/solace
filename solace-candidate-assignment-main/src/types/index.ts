/**
 * Core type definitions for the Solace Advocates application
 */

/**
 * Represents an advocate in the system
 */
export interface Advocate {
  /** Unique identifier for the advocate */
  id?: number;
  /** Advocate's first name */
  firstName: string;
  /** Advocate's last name */
  lastName: string;
  /** City where the advocate is located */
  city: string;
  /** Educational degree or qualification */
  degree: string;
  /** Array of specialties the advocate practices */
  specialties: string[];
  /** Number of years of professional experience */
  yearsOfExperience: number;
  /** Phone number as a numeric value */
  phoneNumber: number;
  /** Creation timestamp (optional for frontend usage) */
  createdAt?: string;
}

/**
 * API response structure for advocates endpoint
 */
export interface AdvocatesApiResponse {
  /** Array of advocate data */
  data: Advocate[];
}

/**
 * Error response structure for API calls
 */
export interface ApiErrorResponse {
  /** Error message */
  error: string;
  /** HTTP status code */
  status?: number;
  /** Additional error details */
  details?: unknown;
}

/**
 * Search filter configuration
 */
export interface SearchFilters {
  /** Search term to filter advocates */
  searchTerm: string;
  /** Optional specialty filter */
  specialty?: string;
  /** Optional city filter */
  city?: string;
  /** Minimum years of experience filter */
  minExperience?: number;
}

/**
 * Component state for loading operations
 */
export interface LoadingState {
  /** Whether a loading operation is in progress */
  isLoading: boolean;
  /** Error message if operation failed */
  error: string | null;
  /** Success message if operation completed */
  success?: string | null;
}

/**
 * Utility type for form input handlers
 */
export type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

/**
 * Utility type for button click handlers
 */
export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;