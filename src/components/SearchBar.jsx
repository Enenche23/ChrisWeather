import React, { useState } from 'react';
import { Search, Thermometer } from 'lucide-react'; 

function SearchBar({ query, onSearch, units, onToggleUnits }) {
  const [localQuery, setLocalQuery] = useState(query);

  const handleInputChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(localQuery);
    }
  };

  const handleSearchClick = () => {
    onSearch(localQuery);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 rounded-xl shadow-lg bg-white/90 backdrop-blur-sm mb-8">
      {/* Search Input and Button: Now using flexbox */}
      <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200 bg-white">
        {/* Search button/icon placed first in the flex order */}
        <button
          onClick={handleSearchClick}
          className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none flex-shrink-0" // flex-shrink-0 ensures it keeps its size
          aria-label="Search city"
        >
          <Search size={24} />
        </button>
        {/* Input field takes remaining space */}
        <input
          type="text"
          className="flex-grow py-2 pr-4 text-lg text-gray-800 placeholder-gray-400 focus:outline-none" // flex-grow makes it fill available space
          placeholder="Enter city name..."
          value={localQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Units Toggle Button */}
      <button
        onClick={onToggleUnits}
        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-lg font-medium"
        aria-label="Toggle units"
      >
        <Thermometer size={20} className="mr-2" /> {units === 'metric' ? '°C' : '°F'}
      </button>
    </div>
  );
}

export default SearchBar;
