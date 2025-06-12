"use client"

import { useState } from "react"
import { Key, ExternalLink } from "lucide-react"

const ApiKeyInput = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (apiKey.trim()) {
      onSubmit(apiKey.trim())
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <Key className="mx-auto text-blue-600 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">API Key Required</h2>
        <p className="text-gray-600">To use this weather app, you need a free API key from OpenWeatherMap.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your OpenWeather API Key:
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Start Using Weather App
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          {showInstructions ? "Hide" : "Show"} instructions to get a free API key
        </button>

        {showInstructions && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">How to get a free API key:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>
                Visit{" "}
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  OpenWeatherMap API <ExternalLink size={12} className="ml-1" />
                </a>
              </li>
              <li>Click on "Get API key" and sign up for a free account</li>
              <li>Verify your email address</li>
              <li>Go to your API keys section in your account</li>
              <li>Copy your API key and paste it above</li>
            </ol>
            <p className="mt-3 text-xs text-gray-600">
              Note: It may take a few minutes for your API key to become active after registration.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Privacy Note:</strong> Your API key will be stored locally in your browser and never sent to any
          server other than OpenWeatherMap.
        </p>
      </div>
    </div>
  )
}

export default ApiKeyInput
