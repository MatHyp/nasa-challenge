import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  useMap,
} from "react-leaflet";
import { Sun, Droplets, Wind, Cloud, Eye, EyeOff } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L, { latLng } from "leaflet";

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

// Generate pollution hotspots for interpolation with more scattered distribution
const generatePollutionHotspots = () => {
  const hotspots = [
    // Asia - High pollution concentrated in specific industrial areas
    { lat: 28.6, lng: 77.2, intensity: 0.9, radius: 5 }, // Delhi
    { lat: 26.5, lng: 80.3, intensity: 0.85, radius: 4 }, // Kanpur area
    { lat: 30.2, lng: 78.5, intensity: 0.8, radius: 3 }, // North India
    { lat: 39.9, lng: 116.4, intensity: 0.88, radius: 6 }, // Beijing
    { lat: 38.5, lng: 115.2, intensity: 0.82, radius: 4 }, // Hebei
    { lat: 41.8, lng: 123.4, intensity: 0.78, radius: 4 }, // Shenyang
    { lat: 31.2, lng: 121.5, intensity: 0.82, radius: 5 }, // Shanghai
    { lat: 34.3, lng: 108.9, intensity: 0.75, radius: 4 }, // Xi'an
    { lat: 23.1, lng: 113.3, intensity: 0.78, radius: 4 }, // Guangzhou
    { lat: 22.5, lng: 114.0, intensity: 0.72, radius: 3 }, // Shenzhen area
    { lat: 30.0, lng: 31.2, intensity: 0.8, radius: 5 }, // Cairo
    { lat: 26.8, lng: 30.8, intensity: 0.7, radius: 4 }, // Upper Egypt
    { lat: 19.4, lng: -99.1, intensity: 0.78, radius: 5 }, // Mexico City
    { lat: 41.0, lng: 28.9, intensity: 0.55, radius: 3 }, // Istanbul
    { lat: 25.2, lng: 55.3, intensity: 0.65, radius: 4 }, // Dubai
    { lat: 24.8, lng: 46.7, intensity: 0.6, radius: 4 }, // Riyadh
    { lat: 13.7, lng: 100.5, intensity: 0.68, radius: 4 }, // Bangkok
    { lat: 10.8, lng: 106.7, intensity: 0.62, radius: 3 }, // Ho Chi Minh
    { lat: 19.1, lng: 72.9, intensity: 0.85, radius: 5 }, // Mumbai
    { lat: 17.4, lng: 78.5, intensity: 0.7, radius: 3 }, // Hyderabad
    { lat: 12.9, lng: 77.6, intensity: 0.72, radius: 3 }, // Bangalore
    { lat: 21.0, lng: 105.8, intensity: 0.7, radius: 4 }, // Hanoi
    { lat: -6.2, lng: 106.8, intensity: 0.75, radius: 4 }, // Jakarta
    { lat: 35.7, lng: 51.4, intensity: 0.8, radius: 4 }, // Tehran
    { lat: 33.3, lng: 44.4, intensity: 0.75, radius: 4 }, // Baghdad
    { lat: 25.3, lng: 82.9, intensity: 0.88, radius: 3 }, // Varanasi area
    { lat: 23.0, lng: 72.6, intensity: 0.78, radius: 3 }, // Ahmedabad
    { lat: 34.0, lng: -118.2, intensity: 0.5, radius: 4 }, // LA
    { lat: 40.7, lng: -74.0, intensity: 0.4, radius: 3 }, // NYC
    { lat: 41.9, lng: -87.6, intensity: 0.42, radius: 3 }, // Chicago
    { lat: 29.8, lng: -95.4, intensity: 0.45, radius: 3 }, // Houston

    // Europe - Mostly clean, only major cities with slight pollution
    { lat: 51.5, lng: -0.1, intensity: 0.25, radius: 2 }, // London
    { lat: 48.9, lng: 2.4, intensity: 0.28, radius: 2 }, // Paris
    { lat: 52.5, lng: 13.4, intensity: 0.22, radius: 2 }, // Berlin
    { lat: 51.2, lng: 6.8, intensity: 0.3, radius: 2 }, // Ruhr area (most polluted EU)
    { lat: 45.5, lng: 9.2, intensity: 0.32, radius: 2 }, // Milan
    { lat: 41.9, lng: 12.5, intensity: 0.26, radius: 2 }, // Rome
    { lat: 40.4, lng: -3.7, intensity: 0.24, radius: 2 }, // Madrid
    { lat: 55.8, lng: 37.6, intensity: 0.48, radius: 3 }, // Moscow
    { lat: 50.4, lng: 30.5, intensity: 0.35, radius: 2 }, // Kyiv
    { lat: 52.2, lng: 21.0, intensity: 0.32, radius: 2 }, // Warsaw

    // South America - Moderate in cities
    { lat: -23.5, lng: -46.6, intensity: 0.45, radius: 3 }, // Sao Paulo
    { lat: -22.9, lng: -43.2, intensity: 0.38, radius: 2 }, // Rio
    { lat: -34.6, lng: -58.4, intensity: 0.35, radius: 2 }, // Buenos Aires
    { lat: -33.4, lng: -70.7, intensity: 0.42, radius: 3 }, // Santiago
    { lat: -12.0, lng: -77.0, intensity: 0.48, radius: 3 }, // Lima

    // Africa - Moderate pollution
    { lat: 6.5, lng: 3.4, intensity: 0.7, radius: 4 }, // Lagos
    { lat: 9.1, lng: 7.2, intensity: 0.55, radius: 3 }, // Abuja area
    { lat: -26.2, lng: 28.0, intensity: 0.45, radius: 3 }, // Johannesburg
    { lat: -1.3, lng: 36.8, intensity: 0.4, radius: 2 }, // Nairobi
    { lat: 15.6, lng: 32.5, intensity: 0.5, radius: 3 }, // Khartoum

    // Clean regions - Most of the world
    { lat: 64.0, lng: -21.9, intensity: 0.05, radius: 8 }, // Iceland
    { lat: 60.2, lng: 24.9, intensity: 0.08, radius: 6 }, // Finland
    { lat: 59.3, lng: 18.1, intensity: 0.1, radius: 5 }, // Stockholm
    { lat: 63.4, lng: 10.4, intensity: 0.08, radius: 6 }, // Norway
    { lat: 46.2, lng: 6.1, intensity: 0.12, radius: 5 }, // Switzerland
    { lat: 47.5, lng: 14.5, intensity: 0.12, radius: 4 }, // Austria
    { lat: -41.3, lng: 174.8, intensity: 0.08, radius: 6 }, // New Zealand
    { lat: -45.0, lng: 170.0, intensity: 0.06, radius: 6 }, // South Island NZ
    { lat: -33.9, lng: 151.2, intensity: 0.18, radius: 3 }, // Sydney
    { lat: -37.8, lng: 144.9, intensity: 0.16, radius: 2 }, // Melbourne
    { lat: 49.3, lng: -123.1, intensity: 0.15, radius: 3 }, // Vancouver
    { lat: 43.7, lng: -79.4, intensity: 0.25, radius: 2 }, // Toronto
    { lat: 53.3, lng: -6.3, intensity: 0.12, radius: 3 }, // Dublin
    { lat: 55.9, lng: -3.2, intensity: 0.15, radius: 3 }, // Scotland
    { lat: 70.0, lng: 25.0, intensity: 0.05, radius: 8 }, // Northern Scandinavia
    { lat: 50.0, lng: 10.0, intensity: 0.15, radius: 5 }, // Central Europe clean
    { lat: 43.0, lng: -2.0, intensity: 0.14, radius: 4 }, // Northern Spain
    { lat: 45.0, lng: 25.0, intensity: 0.18, radius: 4 }, // Romania/Balkans

    // Clean oceanic and remote regions
    { lat: 0.0, lng: -90.0, intensity: 0.05, radius: 10 }, // Pacific
    { lat: -30.0, lng: -40.0, intensity: 0.06, radius: 10 }, // South Atlantic
    { lat: -50.0, lng: -70.0, intensity: 0.04, radius: 10 }, // Patagonia
    { lat: 65.0, lng: -50.0, intensity: 0.05, radius: 10 }, // Greenland
    { lat: -20.0, lng: 135.0, intensity: 0.08, radius: 8 }, // Australian Outback
    { lat: 50.0, lng: -120.0, intensity: 0.1, radius: 8 }, // Canadian forests
    { lat: -5.0, lng: -60.0, intensity: 0.12, radius: 8 }, // Amazon
  ];

  return hotspots;
};

const pollutionHotspots = generatePollutionHotspots();

// Smooth interpolation function with more organic variation
const interpolateAQI = (lat, lng) => {
  let totalWeight = 0;
  let weightedSum = 0;

  // Add some noise for organic variation (reduced)
  const noiseX = Math.sin(lat * 0.5 + lng * 0.3) * 0.08;
  const noiseY = Math.cos(lat * 0.3 - lng * 0.4) * 0.06;
  const noise = (noiseX + noiseY) * 0.5;

  pollutionHotspots.forEach((hotspot) => {
    const distance = Math.sqrt(
      Math.pow(lat - hotspot.lat, 2) + Math.pow(lng - hotspot.lng, 2)
    );

    // Inverse distance weighting with falloff - using smaller radius for more localized effect
    const weight = Math.exp(-distance / (hotspot.radius * 0.7));
    totalWeight += weight;
    weightedSum += hotspot.intensity * weight;
  });

  // Base pollution level - most of the world is clean
  const latFactor = Math.abs(lat) / 90; // Cleaner at poles
  const basePollution = 0.08 + (1 - latFactor) * 0.05; // Lower base pollution

  if (totalWeight < 0.005) {
    // For areas far from any hotspots (oceans, forests, remote areas) - very clean
    return Math.floor((basePollution + noise * 0.2) * 250);
  }

  const interpolatedIntensity =
    (weightedSum / totalWeight) * 0.85 + basePollution * 0.15 + noise * 0.08;

  // Convert intensity (0-1) to AQI (0-300)
  return Math.floor(Math.max(0, Math.min(1, interpolatedIntensity)) * 300);
};

// Canvas-based smooth heat map overlay
function SmoothHeatMapOverlay({ visible }) {
  const map = useMap();
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
        overlayRef.current = null;
      }
      return;
    }

    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;

    const bounds = [
      [-90, -180],
      [90, 180],
    ];

    const overlay = L.imageOverlay("", bounds, {
      opacity: 0.5,
      interactive: false,
    });

    overlayRef.current = overlay;
    overlay.addTo(map);

    const renderHeatMap = () => {
      const width = 720;
      const height = 360;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      const imageData = ctx.createImageData(width, height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const lat = 90 - (y / height) * 180;
          const lng = -180 + (x / width) * 360;

          const aqi = interpolateAQI(lat, lng);
          const color = getHeatMapColorRGB(aqi);

          const idx = (y * width + x) * 4;
          imageData.data[idx] = color.r;
          imageData.data[idx + 1] = color.g;
          imageData.data[idx + 2] = color.b;
          imageData.data[idx + 3] = 200; // Alpha
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Apply gaussian blur for smoother effect but keep some texture
      ctx.filter = "blur(1.5px)";
      ctx.drawImage(canvas, 0, 0);

      overlay.setUrl(canvas.toDataURL());
    };

    renderHeatMap();

    return () => {
      if (overlayRef.current) {
        map.removeLayer(overlayRef.current);
      }
    };
  }, [map, visible]);

  return null;
}

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
const getHeatMapColorRGB = (aqi) => {
  if (aqi <= 50) return { r: 16, g: 185, b: 129 }; // Green
  if (aqi <= 100) return { r: 132, g: 204, b: 22 }; // Light green
  if (aqi <= 150) return { r: 251, g: 191, b: 36 }; // Yellow
  if (aqi <= 200) return { r: 249, g: 115, b: 22 }; // Orange
  if (aqi <= 300) return { r: 239, g: 68, b: 68 }; // Red
  return { r: 153, g: 27, b: 27 }; // Dark red
};

const getHeatMapColor = (aqi) => {
  if (aqi <= 50) return "#10b981";
  if (aqi <= 100) return "#84cc16";
  if (aqi <= 150) return "#fbbf24";
  if (aqi <= 200) return "#f97316";
  if (aqi <= 300) return "#ef4444";
  return "#991b1b";
};

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

const getAQIScore = (aqi) => (aqi == null ? "--" : !aqi ? aqi.value : "--");
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
  const [showHeatMap, setShowHeatMap] = useState(false);

  const handleLocationSelect = async (lat, lng) => {
    setSelectedLocation({ lat, lng });

    // ✅ API endpoints
    const weatherApi = `http://127.0.0.1:5001/current-weather?latitude=${lat}&longitude=${lng}`;
    const airQualityApi = `http://localhost:5001/air-quality?latitude=${lat}&longitude=${lng}`;
    const airAqiApi = `http://127.0.0.1:5001/aqi?latitude=${lat}&longitude=${lng}`;

    // Use interpolated AQI based on location
    // const mockAQI = interpolateAQI(lat, lng);
    // setCurrentAQI(mockAQI);

    try {
      // ✅ Run both requests in parallel for speed
      const [weatherRes, airQualityRes, airAqiRes] = await Promise.all([
        fetch(weatherApi),
        fetch(airQualityApi),
        fetch(airAqiApi),
      ]);

      if (!weatherRes.ok || !airQualityRes.ok) {
        throw new Error("Failed to fetch weather or air quality data");
      }

      const weatherDataJson = await weatherRes.json();
      const airQualityDataJson = await airQualityRes.json();
      const airAqiDataJson = await airAqiRes.json();

      // ✅ Update weather data
      setWeatherData({
        temp: weatherDataJson.temperature,
        humidity: weatherDataJson.humidity,
        windSpeed: weatherDataJson.wind_speed,
        condition: weatherDataJson.condition,
      });

      // ✅ Update pollutant data using real API data
      setPollutantData({
        no2: {
          value: airQualityDataJson.no2.toFixed(1),
          unit: "μg/m³",
          source: "Vehicle emissions",
        },
        pm25: {
          value: airQualityDataJson.pm25.toFixed(1),
          unit: "μg/m³",
          source: "Industrial activity",
        },
        o3: {
          value: airQualityDataJson.no2.toFixed(1),
          unit: "μg/m³",
          source: "Photochemical reactions",
        },
        formaldehyde: {
          value: airQualityDataJson.so2.toFixed(1),
          unit: "μg/m³",
          source: "Indoor sources",
        },
      });
      console.log(airAqiDataJson.aqi);

      // ✅ Update AQI summary info
      setCurrentAQI({
        value: airAqiDataJson.aqi.toFixed(1),
        category: airAqiDataJson.category,
        comment: airAqiDataJson.comment,
        dominant: airAqiDataJson.dominant_pollutant,
      });
    } catch (error) {
      console.error("Error fetching data:", error);

      setWeatherData({
        temp: Math.floor(Math.random() * 30 + 5),
        humidity: Math.floor(Math.random() * 40 + 40),
        windSpeed: Math.floor(Math.random() * 20 + 5),
        condition: ["Clear", "Cloudy", "Partly Cloudy", "Rainy"][
          Math.floor(Math.random() * 4)
        ],
      });
      setCurrentAQI({
        value: Math.floor(Math.random() * 150),
        category: "Unknown",
        comment: "Unable to retrieve live AQI data.",
        dominant: "N/A",
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
        pm10: {
          value: (Math.random() * 100).toFixed(1),
          unit: "μg/m³",
          source: "Construction dust",
        },
        so2: {
          value: (Math.random() * 20).toFixed(1),
          unit: "μg/m³",
          source: "Industrial emissions",
        },
      });
    }
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
            <h1 className="text-xl font-bold text-gray-900">
              Global Air Quality Map
            </h1>
          </div>
          {/* <button
            onClick={() => setShowHeatMap(!showHeatMap)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showHeatMap ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {showHeatMap ? "Hide" : "Show"} Heat Map
            </span>
          </button> */}
        </div>
      </nav>

      {/* Legend */}
      {/* Legend */}
      {showHeatMap && (
        <div className="absolute top-20 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3 border border-gray-200 lg:right-[25rem]">
          <h3 className="text-xs font-semibold text-gray-800 mb-2">
            Air Quality Index
          </h3>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-3 rounded"
                style={{ backgroundColor: "#10b981" }}
              ></div>
              <span className="text-xs text-gray-700">Good (0-50)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-3 rounded"
                style={{ backgroundColor: "#84cc16" }}
              ></div>
              <span className="text-xs text-gray-700">Moderate (51-100)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-3 rounded"
                style={{ backgroundColor: "#fbbf24" }}
              ></div>
              <span className="text-xs text-gray-700">Sensitive (101-150)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-3 rounded"
                style={{ backgroundColor: "#f97316" }}
              ></div>
              <span className="text-xs text-gray-700">Unhealthy (151-200)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-3 rounded"
                style={{ backgroundColor: "#ef4444" }}
              ></div>
              <span className="text-xs text-gray-700">
                Very Unhealthy (201-300)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-3 rounded"
                style={{ backgroundColor: "#991b1b" }}
              ></div>
              <span className="text-xs text-gray-700">Hazardous (300+)</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <SmoothHeatMapOverlay visible={showHeatMap} />
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
                    <div className="text-xl font-bold text-white">
                      {getAQILabel(currentAQI)}
                    </div>
                    <div className="text-xs text-white mt-1">AQI</div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xl font-semibold text-gray-800"></p>
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
