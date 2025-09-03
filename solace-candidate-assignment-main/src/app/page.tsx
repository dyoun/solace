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
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p>Loading advocates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p style={{ color: "red" }}>Error: {error}</p>
      </main>
    );
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input style={{ border: "1px solid black" }} value={searchTerm} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            const uniqueKey = `${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`;
            return (
              <tr key={uniqueKey}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((specialty) => (
                    <div key={specialty}>{specialty}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
