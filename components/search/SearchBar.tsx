'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types';

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search products...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search term from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.products);
      } else {
        setSearchResults([]);
      }

      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    // Clear results if search term is cleared
    if (!e.target.value.trim()) {
      setSearchResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ibfashionhub-red focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-4 bg-ibfashionhub-red text-white rounded-r-md hover:bg-red-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Search results dropdown - only show when searching and have results */}
      {isSearching && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200">
          <div className="p-4 text-center">Searching...</div>
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-96 overflow-y-auto">
          <div className="py-2">
            {searchResults.slice(0, 5).map((product) => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-600">${(product.price / 100).toFixed(2)}</div>
              </a>
            ))}
            {searchResults.length > 5 && (
              <a
                href={`/search?q=${encodeURIComponent(searchTerm)}`}
                className="block px-4 py-2 text-center text-ibfashionhub-red hover:bg-gray-100 rounded-b-md"
              >
                See all {searchResults.length} results
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;