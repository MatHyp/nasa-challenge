import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { Sun, Droplets, Wind, Cloud } from "lucide-react";
import "leaflet/dist/leaflet.css";
import SearchBar from "./SearchBar";
// Fix Leaflet default icon issue
import L from "leaflet";

const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });

  return null;
}

// Helper functions
const getAQIColor = (aqi) => {
  if (aqi <= 50) return "bg-green-500";
  if (aqi <= 100) return "bg-yellow-500";
  if (aqi <= 150) return "bg-orange-500";
  if (aqi <= 200) return "bg-red-500";
  if (aqi <= 300) return "bg-purple-500";
  return "bg-rose-900";
};

const getAQILabel = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

const getHealthRecommendation = (aqi) => {
  if (aqi <= 50)
    return "Air quality is satisfactory, and air pollution poses little or no risk.";
  if (aqi <= 100)
    return "Air quality is acceptable. However, there may be a risk for some people.";
  if (aqi <= 150)
    return "Members of sensitive groups may experience health effects.";
  if (aqi <= 200)
    return "Some members of the general public may experience health effects.";
  if (aqi <= 300)
    return "Health alert: The risk of health effects is increased for everyone.";
  return "Health warning of emergency conditions: everyone is more likely to be affected.";
};

const MapView = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentAQI, setCurrentAQI] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [pollutantData, setPollutantData] = useState(null);

  const handleLocationSelect = (lat, lng) => {
    setSelectedLocation({ lat, lng });

    // Simulate fetching data (replace with actual API calls)
    const mockAQI = Math.floor(Math.random() * 300);
    setCurrentAQI(mockAQI);

    setWeatherData({
      temp: Math.floor(Math.random() * 30 + 5),
      humidity: Math.floor(Math.random() * 40 + 40),
      windSpeed: Math.floor(Math.random() * 20 + 5),
      condition: ["Clear", "Cloudy", "Partly Cloudy", "Rainy"][
        Math.floor(Math.random() * 4)
      ],
    });

    setPollutantData({
      no2: {
        value: (Math.random() * 50).toFixed(1),
        unit: "μg/m³",
        source: "Vehicle emissions",
      },
      pm25: {
        value: (Math.random() * 100).toFixed(1),
        unit: "μg/m³",
        source: "Industrial activity",
      },
      o3: {
        value: (Math.random() * 80).toFixed(1),
        unit: "μg/m³",
        source: "Photochemical reactions",
      },
      formaldehyde: {
        value: (Math.random() * 30).toFixed(1),
        unit: "μg/m³",
        source: "Indoor sources",
      },
    });
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Air Quality Map</h1>
          </div>
          <div className="w-full md:w-auto">
            <SearchBar />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={[53.3926, 14.5378]}
            zoom={10}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            )}
          </MapContainer>
        </div>

        {/* Data Cards Panel */}
        {selectedLocation && (
          <div className="lg:w-96 bg-gray-50 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">Location Data</h2>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Lat: {selectedLocation.lat.toFixed(4)}, Lng:{" "}
              {selectedLocation.lng.toFixed(4)}
            </p>

            {/* Current AQI Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Current Air Quality
              </h3>
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Weather Conditions
              </h3>
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Key Pollutants
              </h3>
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
        )}
      </div>
    </div>
  );
};

export default MapView;
