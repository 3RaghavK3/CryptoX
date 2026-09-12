import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function CoinSearch({ onSelect = undefined, placeholder = "Search for a coin...", className = "" }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 2. Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchResults = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coins/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      setResults(data.coins || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // 1. Debounce + search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchResults(query);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (coin) => {
    setQuery('');
    setShowDropdown(false);

    if (onSelect) {
      onSelect(coin);
    } else {
      // Default behavior if onSelect isn't provided: navigate to coin detail page
      navigate(`/coindetail/${coin.id}`);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          className="pl-9 bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500 rounded-xl h-10 w-full focus-visible:ring-slate-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border-slate-700 z-50 overflow-hidden shadow-2xl">
          <ul className="flex flex-col">
            {results.map((coin) => (
              <li
                key={coin.id}
                onClick={() => handleResultClick(coin)}
                className="flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-800/50 last:border-0"
              >
                <img src={coin.large} alt={coin.name} className="w-8 h-8 rounded-full bg-slate-800" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-200 truncate">{coin.name}</span>
                  <span className="text-xs text-slate-500 uppercase">{coin.symbol}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {showDropdown && query.length > 0 && results.length === 0 && !isSearching && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border-slate-700 z-50 p-4 text-center text-sm text-slate-400 shadow-2xl">
          No coins found matching "{query}"
        </Card>
      )}
    </div>
  );
}
