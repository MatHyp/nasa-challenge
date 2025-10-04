import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Wind,
  Droplets,
  Sun,
  Cloud,
  MapPin,
  Bell,
  TrendingUp,
  Activity,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const AirQualityApp = () => {
  const [selectedLocation, setSelectedLocation] = useState("New York, NY");
  const [currentAQI, setCurrentAQI] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [pollutantData, setPollutantData] = useState(null);
  const [notifications, setNotifications] = useState(true);

  // Symulacja danych (w rzeczywistej aplikacji byłyby to wywołania API)
  useEffect(() => {
    generateMockData();
  }, [selectedLocation]);

  const generateMockData = () => {
    // Generowanie aktualnego AQI
    const aqi = Math.floor(Math.random() * 150) + 20;
    setCurrentAQI(aqi);

    // Generowanie alertów
    const mockAlerts = [];
    if (aqi > 100) {
      mockAlerts.push({
        level: "warning",
        message:
          "Unhealthy for Sensitive Groups - Limit prolonged outdoor activities",
        time: "Now",
      });
    }
    if (Math.random() > 0.7) {
      mockAlerts.push({
        level: "info",
        message: "Ozone levels expected to rise in the afternoon",
        time: "2 hours",
      });
    }
    setAlerts(mockAlerts);

    // Generowanie prognozy na 24h
    const forecast = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
      forecast.push({
        time: hour.getHours() + ":00",
        aqi: Math.floor(Math.random() * 100) + 30 + Math.sin(i / 4) * 30,
        pm25: Math.floor(Math.random() * 50) + 10,
        no2: Math.floor(Math.random() * 40) + 5,
        o3: Math.floor(Math.random() * 60) + 20,
      });
    }
    setForecastData(forecast);

    // Dane pogodowe
    setWeatherData({
      temp: Math.floor(Math.random() * 15) + 15,
      humidity: Math.floor(Math.random() * 30) + 50,
      windSpeed: Math.floor(Math.random() * 10) + 5,
      condition: ["Sunny", "Cloudy", "Partly Cloudy"][
        Math.floor(Math.random() * 3)
      ],
    });

    // Dane zanieczyszczeń z TEMPO
    setPollutantData({
      no2: {
        value: Math.floor(Math.random() * 40) + 10,
        unit: "ppb",
        source: "NASA TEMPO",
      },
      pm25: {
        value: Math.floor(Math.random() * 35) + 5,
        unit: "µg/m³",
        source: "Ground Station",
      },
      o3: {
        value: Math.floor(Math.random() * 60) + 20,
        unit: "ppb",
        source: "NASA TEMPO",
      },
      formaldehyde: {
        value: (Math.random() * 3 + 1).toFixed(1),
        unit: "ppb",
        source: "NASA TEMPO",
      },
    });
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    return "bg-purple-600";
  };

  const getAQILabel = (aqi) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    return "Very Unhealthy";
  };

  const getHealthRecommendation = (aqi) => {
    if (aqi <= 50)
      return "Air quality is great! Perfect for outdoor activities.";
    if (aqi <= 100)
      return "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor activities.";
    if (aqi <= 150)
      return "Members of sensitive groups may experience health effects. General public is less likely to be affected.";
    if (aqi <= 200)
      return "Everyone may begin to experience health effects. Sensitive groups should avoid prolonged outdoor activities.";
    return "Health alert! Everyone should avoid outdoor activities.";
  };

  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Denver, CO",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Wind className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AirWatch</h1>
                <p className="text-sm text-gray-500">Powered by NASA TEMPO</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setNotifications(!notifications)}
                className={`p-2 rounded-lg transition-colors ${
                  notifications
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Location Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Select Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.level === "warning"
                    ? "bg-orange-50 border-orange-500"
                    : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex items-start">
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 mr-3 ${
                      alert.level === "warning"
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Expected in {alert.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Current AQI Card */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Current Air Quality
            </h2>
            <div className="text-center">
              <div
                className={`mx-auto w-32 h-32 rounded-full ${getAQIColor(
                  currentAQI
                )} flex items-center justify-center shadow-lg`}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">
                    {currentAQI}
                  </div>
                  <div className="text-xs text-white mt-1">AQI</div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xl font-semibold text-gray-800">
                  {getAQILabel(currentAQI)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {getHealthRecommendation(currentAQI)}
                </p>
              </div>
            </div>
          </div>

          {/* Weather Card */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Weather Conditions
            </h2>
            {weatherData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sun className="h-6 w-6 text-yellow-500" />
                    <span className="text-gray-700">Temperature</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">
                    {weatherData.temp}°C
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Droplets className="h-6 w-6 text-blue-500" />
                    <span className="text-gray-700">Humidity</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">
                    {weatherData.humidity}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Wind className="h-6 w-6 text-gray-500" />
                    <span className="text-gray-700">Wind Speed</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">
                    {weatherData.windSpeed} mph
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Cloud className="h-6 w-6 text-gray-400" />
                    <span className="text-gray-700">Condition</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">
                    {weatherData.condition}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Pollutants Card */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Key Pollutants
            </h2>
            {pollutantData && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-700 font-medium">NO₂</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {pollutantData.no2.value} {pollutantData.no2.unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Source: {pollutantData.no2.source}
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-700 font-medium">PM2.5</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {pollutantData.pm25.value} {pollutantData.pm25.unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Source: {pollutantData.pm25.source}
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-700 font-medium">O₃</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {pollutantData.o3.value} {pollutantData.o3.unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Source: {pollutantData.o3.source}
                  </p>
                </div>
                <div className="pb-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-700 font-medium">HCHO</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {pollutantData.formaldehyde.value}{" "}
                      {pollutantData.formaldehyde.unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Source: {pollutantData.formaldehyde.source}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 24-Hour Forecast Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
            24-Hour AQI Forecast
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis
                stroke="#6b7280"
                label={{ value: "AQI", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorAqi)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Pollutants Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
            Pollutant Trends (24h)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#f59e0b"
                strokeWidth={2}
                name="PM2.5 (µg/m³)"
              />
              <Line
                type="monotone"
                dataKey="no2"
                stroke="#ef4444"
                strokeWidth={2}
                name="NO₂ (ppb)"
              />
              <Line
                type="monotone"
                dataKey="o3"
                stroke="#3b82f6"
                strokeWidth={2}
                name="O₃ (ppb)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Info Footer */}
        <div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">Data Sources</p>
              <p>
                This application integrates data from NASA TEMPO satellite,
                ground-based monitoring stations (Pandora, OpenAQ), and weather
                services to provide comprehensive air quality forecasts. Data is
                updated every hour.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AirQualityApp;
