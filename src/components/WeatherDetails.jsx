import { Sunrise, Sunset, Thermometer, Eye, Gauge, CloudRain } from "lucide-react"

const WeatherDetails = ({ weather, units }) => {
  if (!weather) return null

  const {
    main: { temp_min, temp_max, pressure },
    sys: { sunrise, sunset },
    visibility,
    clouds: { all: cloudiness },
  } = weather

  const tempUnit = units === "metric" ? "°C" : "°F"
  const pressureUnit = "hPa"
  const visibilityKm = (visibility / 1000).toFixed(1)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const detailItems = [
    {
      icon: <Sunrise className="text-orange-500" size={24} />,
      label: "Sunrise",
      value: formatTime(sunrise),
    },
    {
      icon: <Sunset className="text-red-500" size={24} />,
      label: "Sunset",
      value: formatTime(sunset),
    },
    {
      icon: <Thermometer className="text-red-600" size={24} />,
      label: "Min Temp",
      value: `${Math.round(temp_min)}${tempUnit}`,
    },
    {
      icon: <Thermometer className="text-orange-600" size={24} />,
      label: "Max Temp",
      value: `${Math.round(temp_max)}${tempUnit}`,
    },
    {
      icon: <Gauge className="text-blue-600" size={24} />,
      label: "Pressure",
      value: `${pressure} ${pressureUnit}`,
    },
    {
      icon: <Eye className="text-gray-600" size={24} />,
      label: "Visibility",
      value: `${visibilityKm} km`,
    },
    {
      icon: <CloudRain className="text-blue-400" size={24} />,
      label: "Cloudiness",
      value: `${cloudiness}%`,
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Weather Details</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {detailItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
            <div className="mb-2">{item.icon}</div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherDetails
