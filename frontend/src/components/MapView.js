import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import SearchBar from "./SearchBar";

// Fix Leaflet default icon issue
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map click handler component
function MapClickHandler() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      navigate(`/details/${lat}/${lng}`);
    },
  });

  return null;
}

const MapView = () => {
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

      {/* Map Container */}
      <div className="flex-1">
        <MapContainer
          center={[53.400023148966575, -345.49716211159915]} // Default center (New York)
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
