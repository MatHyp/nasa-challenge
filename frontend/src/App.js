import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapView from "./components/MapView";
import LocationDetails from "./components/LocationDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapView />} />
        {/* <Route path="/details/:lat/:lng" element={<LocationDetails />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
