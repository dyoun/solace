"use client";

import { useEffect, useState } from "react";
import type { 
  Advocate, 
  AdvocatesApiResponse, 
  InputChangeHandler, 
  ButtonClickHandler 
} from "@/types";

/**
 * Home page component that displays a searchable list of Solace Advocates
 * @returns React component
 */
export default function Home(): JSX.Element {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches advocate data from the API
     */
    const fetchAdvocates = async (): Promise<void> => {
      try {
        console.log("fetching advocates...");
        const response = await fetch("/api/advocates");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonResponse: AdvocatesApiResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch advocates";
        setError(errorMessage);
        console.error("Error fetching advocates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  /**
   * Handles search input changes and filters advocates
   * @param e - Input change event
   */
  const onChange: InputChangeHandler = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    console.log("filtering advocates...");
    const filtered = advocates.filter((advocate) => {
      const searchTerm = term.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm)) ||
        advocate.yearsOfExperience.toString().includes(searchTerm) ||
        advocate.phoneNumber.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filtered);
  };

  /**
   * Handles reset button click to clear search and show all advocates
   */
  const onClick: ButtonClickHandler = () => {
    console.log(advocates);
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Solace Advocates</h1>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
              <p className="text-lg text-gray-600">Loading advocates...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Solace Advocates</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Solace Advocates</h1>
          <p className="text-lg text-gray-600">Find the right mental health advocate for your needs</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Advocates
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name, city, degree, specialties, experience, or phone..."
                  value={searchTerm}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                onClick={onClick}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Reset
              </button>
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Searching for: <span className="font-medium text-indigo-600">{searchTerm}</span>
              </p>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredAdvocates.length}</span> of{" "}
            <span className="font-medium">{advocates.length}</span> advocates
          </p>
        </div>

        {/* Advocates Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credentials</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdvocates.map((advocate) => {
                  const uniqueKey = `${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`;
                  return (
                    <tr key={uniqueKey} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {advocate.firstName} {advocate.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{advocate.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{advocate.degree}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {advocate.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{advocate.yearsOfExperience} years</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{advocate.phoneNumber}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {advocates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No advocates available</h3>
            <p className="text-gray-600">There are currently no advocates in the system. Please check back later.</p>
          </div>
        ) : (
          filteredAdvocates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No advocates found</h3>
              <p className="text-gray-600">Try adjusting your search terms or reset the search to see all advocates.</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
