import React, { useState, useEffect } from "react";
import { Search, Thermometer } from "lucide-react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function SearchBar({ query, onSearch, units, onToggleUnits }) {
  const [localQuery, setLocalQuery] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState(localQuery);

  // Debounce typing
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(localQuery), 300);
    return () => clearTimeout(handler);
  }, [localQuery]);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    async function load() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            debouncedQuery
          )}&limit=5&appid=${API_KEY}`
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      }
    }
    load();
  }, [debouncedQuery]);

  return (
    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6 transition-all duration-300">
      {/* Input + Search */}
      <div className="flex-grow w-full max-w-md relative">
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSuggestions([]);
                onSearch(localQuery);
              }
            }}
            placeholder="Enter city name..."
            className="flex-grow px-4 py-2 text-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={() => {
              setSuggestions([]);
              onSearch(localQuery);
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white transition duration-200"
            aria-label="Search city"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mt-1 w-full rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  const city = `${s.name}, ${s.state ? s.state + ", " : ""}${s.country}`;
                  setLocalQuery(city);
                  setSuggestions([]);
                  onSearch(city);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
              >
                {s.name}
                {s.state ? `, ${s.state}` : ""}, {s.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Units toggle remains unchanged */}
      <button
        onClick={onToggleUnits}
        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg shadow hover:from-blue-600 hover:to-teal-500 transition duration-300 font-semibold"
        aria-label="Toggle temperature units"
      >
        <Thermometer size={20} className="mr-2" />
        {units === "metric" ? "°C 🌡️" : "°F 🔥"}
      </button>
    </div>
  );
}

export default SearchBar;
