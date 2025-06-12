import { MapPin, Droplets, Wind, Thermometer } from "lucide-react"

const CurrentWeather = ({ weather, units }) => {
  if (!weather) return null

  const {
    name,
    main: { temp, feels_like, humidity },
    weather: weatherDetails,
    wind,
    sys: { country },
  } = weather

  const weatherIcon = weatherDetails[0]?.icon
  const weatherDescription = weatherDetails[0]?.description
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  const tempUnit = units === "metric" ? "°C" : "°F"
  const windSpeedUnit = units === "metric" ? "m/s" : "mph"

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <MapPin className="mr-2" size={24} />
              {name}, {country}
            </h2>
            <p className="text-lg capitalize mt-1">{weatherDescription}</p>
          </div>
          <div className="text-center">
            <img src={iconUrl || "/placeholder.svg"} alt={weatherDescription} className="w-20 h-20 inline-block" />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-5xl font-bold">
            {Math.round(temp)}
            {tempUnit}
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end">
              <Thermometer className="mr-1" size={18} />
              Feels like: {Math.round(feels_like)}
              {tempUnit}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Droplets className="text-blue-500 mr-2" size={20} />
          <div>
            <p className="text-gray-500">Humidity</p>
            <p className="font-semibold">{humidity}%</p>
          </div>
        </div>

        <div className="flex items-center">
          <Wind className="text-blue-500 mr-2" size={20} />
          <div>
            <p className="text-gray-500">Wind</p>
            <p className="font-semibold">
              {wind.speed} {windSpeedUnit}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeather
