import React from "react";
import { useParams } from "react-router-dom";
import AirQualityApp from "./AirQualityApp";

const LocationDetails = () => {
  const { lat, lng } = useParams();

  return (
    <div>
      <div className="bg-indigo-600 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold">
            Location: {Number(lat).toFixed(4)}°, {Number(lng).toFixed(4)}°
          </h1>
        </div>
      </div>
      <AirQualityApp initialLocation={{ lat: Number(lat), lng: Number(lng) }} />
    </div>
  );
};

export default LocationDetails;
