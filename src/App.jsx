import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import WeatherDetails from "./components/WeatherDetails";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import ApiKeyInput from "./components/ApiKeyInput";

// Move constants outside component to avoid recreation
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const DEFAULT_CITY = "Lagos"; // Changed default city to Lagos, Nigeria

// Helper function to handle API response errors
const handleApiResponse = async (response, context = "data") => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your OpenWeather API key.");
    }
    if (response.status === 404 && context === "weather") {
      throw new Error("City not found. Please check the spelling and try again.");
    }
    throw new Error(`${context} not available`);
  }
  return response.json();
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState("metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [apiKey, setApiKey] = useState("");

  // NEW STATE: To store the last successfully fetched location's coordinates/name
  const [lastFetchedLocation, setLastFetchedLocation] = useState(null); // { lat, lon, name }

  // Get API key from localStorage or environment
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openweather_api_key");
    const envApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else if (envApiKey) {
      setApiKey(envApiKey);
    }
  }, []); // Empty dependency array, runs once on mount.

  // Initial location fetch when API key is available
  // This effect will run when apiKey changes (e.g., loaded from local storage, or user inputs it)
  useEffect(() => {
    if (!apiKey) return;
    // Only attempt to get location if we haven't already fetched for a location
    // This prevents re-triggering initial geolocation if lastFetchedLocation is already set.
    if (lastFetchedLocation) return; 

    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setLoading(false);
          fetchWeatherByCity(DEFAULT_CITY); // Default to Lagos if location access is denied
        }
      );
    } else {
      fetchWeatherByCity(DEFAULT_CITY); // Geolocation not supported, use default city (Lagos)
    }
  }, [apiKey, lastFetchedLocation]); // Added lastFetchedLocation to dependency to prevent re-fetching initial location if already set.

  // Refetch data when units change OR when the last fetched location changes
  useEffect(() => {
    // Only refetch if we have a previously fetched location and an API key
    if (lastFetchedLocation && apiKey) {
      // Use the stored coordinates for refetching with new units
      fetchWeatherByCoords(lastFetchedLocation.lat, lastFetchedLocation.lon);
    }
  }, [units, apiKey, lastFetchedLocation]); // Depends on lastFetchedLocation for actual location change

  const fetchWeatherData = async (weatherUrl, forecastUrl) => {
    if (!apiKey) {
      setError("Please enter your OpenWeather API key to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await handleApiResponse(weatherResponse, "Weather data");
      setWeather(weatherData);

      // Fetch forecast
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await handleApiResponse(forecastResponse, "Forecast data");
      setForecast(forecastData);

      // Update the search query to show the city name
      setQuery(weatherData.name);

      // IMPORTANT: Update lastFetchedLocation here, but only if coordinates have actually changed
      if (weatherData.coord && weatherData.name) {
        const newLocation = {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon,
          name: weatherData.name,
        };
        // Use a functional update to compare with previous state and prevent unnecessary re-renders
        setLastFetchedLocation(prevLocation => {
          if (!prevLocation || prevLocation.lat !== newLocation.lat || prevLocation.lon !== newLocation.lon) {
            return newLocation; // Coordinates changed, update state with new object
          }
          return prevLocation; // Coordinates are the same, return previous object to avoid re-render
        });
      }

    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(err.message || "Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    const weatherUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

    await fetchWeatherData(weatherUrl, forecastUrl);
  };

  const fetchWeatherByCity = async (city) => {
    if (!city) return;

    if (!apiKey) {
      setError("Please enter your OpenWeather API key to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First get weather data to extract coordinates
      const weatherUrl = `${BASE_URL}/weather?q=${city}&units=${units}&appid=${apiKey}`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await handleApiResponse(weatherResponse, "weather");

      // Use coordinates for forecast to ensure accuracy
      const { lat, lon } = weatherData.coord;
      const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await handleApiResponse(forecastResponse, "Forecast data");

      setWeather(weatherData);
      setForecast(forecastData);
      setQuery(weatherData.name);

      // IMPORTANT: Update lastFetchedLocation here as well, with the same check
      if (weatherData.coord && weatherData.name) {
        const newLocation = {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon,
          name: weatherData.name,
        };
        setLastFetchedLocation(prevLocation => {
          if (!prevLocation || prevLocation.lat !== newLocation.lat || prevLocation.lon !== newLocation.lon) {
            return newLocation;
          }
          return prevLocation;
        });
      }

    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(err.message || "Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    // When searching, this will trigger fetchWeatherByCity,
    // which in turn updates lastFetchedLocation after success.
    fetchWeatherByCity(searchQuery);
    setQuery(searchQuery); // Still useful for the search bar input display
  };

  const handleApiKeySubmit = (key) => {
    setApiKey(key);
    localStorage.setItem("openweather_api_key", key);
    setError(null);
    // After API key submission, the initial useEffect for location will trigger
    // a fetch, which will then set lastFetchedLocation if it's not already set.
  };

  const toggleUnits = () => {
    setUnits((prevUnits) => prevUnits === "metric" ? "imperial" : "metric");
    // Changing units will trigger the useEffect that depends on units and lastFetchedLocation
  };

  const handleChangeApiKey = () => {
    localStorage.removeItem("openweather_api_key");
    setApiKey("");
    setWeather(null);
    setForecast(null);
    setError(null);
    setLastFetchedLocation(null); // Clear last fetched location when changing API key
  };

  // Show API key input if no API key is available
  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans bg-gradient-to-br from-blue-300 via-sky-300 to-indigo-400"> {/* Centered content, weather-themed gradient */}
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 hover:scale-105 border border-blue-200"> {/* Enhanced styling */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
            Weather App
          </h1>
          <ApiKeyInput onSubmit={handleApiKeySubmit} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-sky-400 to-purple-600 p-4 md:p-8 font-sans transition-all duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-10 md:p-20 transform transition-all duration-300 hover:scale-[1.005] border border-blue-100"> {/* Increased max-width, padding */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-center mb-16 tracking-tight !text-transparent !bg-clip-text !bg-gradient-to-r from-blue-700 to-purple-700"> {/* Larger heading, IMPORTANT for colors */}
          Weather Forecast
        </h1>

        <SearchBar
          query={query}
          onSearch={handleSearch}
          units={units}
          onToggleUnits={toggleUnits}
        />

        {loading && <Loading />}

        {error && <ErrorMessage message={error} />}

        {weather && !loading && !error && (
          <div className="mt-20 space-y-20"> {/* Increased space-y */}
            {/* Assuming child components also need their content sized up if they have their own text sizes */}
            <CurrentWeather weather={weather} units={units} />

            {forecast && (
              <>
                <Forecast forecast={forecast} units={units} />
                <WeatherDetails weather={weather} units={units} />
              </>
            )}
          </div>
        )}

        {/* API Key Management */}
        <div className="mt-24 text-center"> {/* Increased top margin */}
          <button
            onClick={handleChangeApiKey}
            className="text-2xl text-blue-700 hover:text-blue-900 underline font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-70 transition-colors duration-200"
          >
            Change API Key
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
