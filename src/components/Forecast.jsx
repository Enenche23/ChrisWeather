import React from "react";
import { motion } from "framer-motion";

const Forecast = ({ forecast, units }) => {
  if (!forecast || !forecast.list) return null;

  const tempUnit = units === "metric" ? "°C" : "°F";

  // Group forecasts by day (every 8 intervals = 24 hours)
  const dailyForecasts = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl shadow-md p-6 transition-colors duration-300">
      <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dailyForecasts.map((item, index) => {
          const date = new Date(item.dt_txt);
          const day = date.toLocaleDateString("en-US", { weekday: "short" });
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
          const description = item.weather[0].description;

          return (
            <motion.div
              key={index}
              className="bg-blue-100 dark:bg-gray-700 rounded-md p-4 text-center shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-lg">{day}</h4>
              <img src={iconUrl} alt={description} className="w-16 h-16 mx-auto" />
              <p className="capitalize text-sm text-gray-600 dark:text-gray-300">{description}</p>
              <p className="mt-2 font-bold">
                {Math.round(item.main.temp)}
                {tempUnit}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
