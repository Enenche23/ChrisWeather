import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Clock from "./components/Clock";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import Forecast from "./components/Forecast";
import WeatherDetails from "./components/WeatherDetails";
import Spinner from "./components/Spinner";
import DarkModeToggle from "./components/DarkModeToggle";
import { fetchWeatherData, fetchForecastData } from "./utils/api";

function App() {
  const [query, setQuery] = useState("Lagos");
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const current = await fetchWeatherData(query, units);
        const forecastData = await fetchForecastData(query, units);
        setWeather(current);
        setForecast(forecastData);
      } catch {
        setError("Unable to fetch weather. Try another city.");
        setWeather(null);
        setForecast(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query, units]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "dark bg-gray-900 text-white"
          : "bg-gradient-to-b from-blue-100 to-blue-300 text-gray-900"
      }`}
    >
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 py-10"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 dark:text-blue-300 transition-colors duration-300">
              Weather Forecast
            </h1>
            <Clock />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DarkModeToggle
              onToggle={() => setDarkMode((prev) => !prev)}
              enabled={darkMode}
            />
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SearchBar
            query={query}
            onSearch={(city) => setQuery(city)}
            units={units}
            onToggleUnits={() =>
              setUnits((prev) => (prev === "metric" ? "imperial" : "metric"))
            }
          />
        </motion.div>

        {/* Weather Data Display */}
        {loading ? (
          <div className="flex justify-center mt-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mt-8">{error}</div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <CurrentWeather weather={weather} units={units} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <HourlyForecast forecast={forecast} units={units} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6"
            >
              <Forecast forecast={forecast} units={units} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6"
            >
              <WeatherDetails weather={weather} units={units} />
            </motion.div>
          </>
        )}
      </motion.main>
    </div>
  );
}

export default App;
