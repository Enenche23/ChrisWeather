"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"

const Forecast = ({ forecast, units }) => {
  const [selectedTab, setSelectedTab] = useState("daily")

  if (!forecast || !forecast.list) return null

  const tempUnit = units === "metric" ? "°C" : "°F"

  // Process forecast data
  const processedData = processForecastData(forecast.list)
  const displayData = selectedTab === "daily" ? processedData.dailyForecast : processedData.hourlyForecast

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Calendar className="mr-2" size={20} />
          {selectedTab === "daily" ? "5-Day" : "24-Hour"} Forecast
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTab("hourly")}
            className={`px-3 py-1 rounded-lg ${
              selectedTab === "hourly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setSelectedTab("daily")}
            className={`px-3 py-1 rounded-lg ${
              selectedTab === "daily" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {displayData.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
              <p className="text-sm font-medium text-gray-500">{selectedTab === "daily" ? item.day : item.time}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt={item.description}
                className="w-12 h-12 my-1"
              />
              <p className="font-semibold">
                {Math.round(item.temp)}
                {tempUnit}
              </p>
              <p className="text-xs text-gray-500 capitalize">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper function to process forecast data
const processForecastData = (forecastList) => {
  // Process hourly forecast (next 24 hours, every 3 hours)
  const hourlyForecast = forecastList.slice(0, 8).map((item) => {
    const date = new Date(item.dt * 1000)
    return {
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp: item.main.temp,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    }
  })

  // Process daily forecast (5 days)
  const dailyMap = forecastList.reduce((acc, item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toLocaleDateString([], { weekday: "short" })

    if (!acc[day]) {
      acc[day] = {
        temps: [],
        icons: [],
        descriptions: [],
      }
    }

    acc[day].temps.push(item.main.temp)
    acc[day].icons.push(item.weather[0].icon)
    acc[day].descriptions.push(item.weather[0].description)

    return acc
  }, {})

  const dailyForecast = Object.keys(dailyMap)
    .slice(0, 5)
    .map((day) => {
      const dayData = dailyMap[day]

      // Get the most common weather condition for the day
      const iconCounts = dayData.icons.reduce((acc, icon) => {
        acc[icon] = (acc[icon] || 0) + 1
        return acc
      }, {})

      const mostCommonIcon = Object.keys(iconCounts).reduce((a, b) => (iconCounts[a] > iconCounts[b] ? a : b))

      const descriptionCounts = dayData.descriptions.reduce((acc, desc) => {
        acc[desc] = (acc[desc] || 0) + 1
        return acc
      }, {})

      const mostCommonDescription = Object.keys(descriptionCounts).reduce((a, b) =>
        descriptionCounts[a] > descriptionCounts[b] ? a : b,
      )

      // Calculate average temperature
      const avgTemp = dayData.temps.reduce((sum, temp) => sum + temp, 0) / dayData.temps.length

      return {
        day,
        temp: avgTemp,
        icon: mostCommonIcon,
        description: mostCommonDescription,
      }
    })

  return { hourlyForecast, dailyForecast }
}

export default Forecast
