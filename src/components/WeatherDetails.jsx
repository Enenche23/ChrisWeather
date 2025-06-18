import React from "react";
import { Sun, Moon } from "lucide-react";

const WeatherDetails = ({ weather, units }) => {
  if (!weather) return null;

  const {
    main: { feels_like, humidity, pressure },
    wind: { speed },
    sys: { sunrise, sunset },
  } = weather;

  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Weather Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex items-center justify-between">
          <span>Feels Like:</span>
          <span className="font-semibold">
            {Math.round(feels_like)}{tempUnit}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Humidity:</span>
          <span className="font-semibold">{humidity}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Pressure:</span>
          <span className="font-semibold">{pressure} hPa</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Wind Speed:</span>
          <span className="font-semibold">{speed} {windUnit}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sun size={16} className="text-yellow-400" />
            Sunrise:
          </span>
          <span className="font-semibold">{formatTime(sunrise)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Moon size={16} className="text-indigo-400" />
            Sunset:
          </span>
          <span className="font-semibold">{formatTime(sunset)}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
