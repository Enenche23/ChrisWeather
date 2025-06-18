import React from "react";
import { motion } from "framer-motion";

const HourlyForecast = ({ forecast, units }) => {
  if (!forecast?.list) return null;
  const now = Date.now();
  const tempUnit = units === "metric" ? "°C" : "°F";
  const nextHours = forecast.list
    .filter(({ dt_txt }) => new Date(dt_txt).getTime() > now)
    .slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6 overflow-x-auto transition-colors duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Hourly Forecast
      </h3>
      <div className="flex space-x-4">
        {nextHours.map((item, i) => {
          const dt = new Date(item.dt_txt).toLocaleTimeString([], {
            hour: "2-digit",
            hour12: true,
          });
          const icon = item.weather[0].icon;
          return (
            <motion.div
              key={i}
              className="flex flex-col items-center min-w-[80px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dt}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt=""
                className="w-12 h-12"
              />
              <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
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

export default HourlyForecast;
