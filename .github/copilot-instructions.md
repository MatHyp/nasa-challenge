# Copilot Instructions for nasa-challenge

## Project Architecture

- **Backend (Python):**
  - `main.py` orchestrates data fetching from three mock APIs: `api_openAQ.py`, `api_pandora.py`, and `api_tolNet.py` in `api_scripts/`. Each returns simulated air quality data.
  - `external_api/server.py` exposes a Flask REST API for smog prediction via `/predict` (POST). It uses a mock neural network in `prediction/neuralnetworkFRmock.py`.
  - Prediction logic is rule-based, not a real ML model. See `get_smog_prediction()` for decision rules.
- **Frontend (React):**
  - Located in `frontend/`, built with Create React App and Tailwind CSS.
  - Main UI logic in `src/components/AirQualityApp.js`. Data is currently simulated in-browser, not fetched from backend.
  - Visualizes AQI, weather, and pollutant trends. Data sources are described in the UI footer.

## Developer Workflows

- **Backend:**
  - Run Flask API: `python external_api/server.py` (port 5001, debug mode).
  - Main script: `python main.py` prints mock data from all sources.
  - Install Python dependencies: `pip install -r requirements.txt`.
- **Frontend:**
  - Start dev server: `cd frontend && npm start` (http://localhost:3000).
  - Run tests: `npm test` in `frontend/`.
  - Build for production: `npm run build`.

## Integration Points

- **Data Flow:**
  - Backend APIs are mocked; frontend does not yet consume backend endpoints.
  - To connect frontend to backend, implement API calls (e.g., to `/predict`) in React and replace mock data generators.
- **External Dependencies:**
  - Python: Flask, random, time.
  - JS: React, recharts, lucide-react, Tailwind CSS.

## Project-Specific Patterns

- **Mocking:** All data sources and predictions are simulated for rapid prototyping.
- **Polish/English Mix:** Some comments and print statements are in Polish.
- **Component Structure:** Frontend uses a single main component for air quality logic; backend is modular by data source.

## Key Files

- `main.py`, `api_scripts/`, `external_api/server.py`, `prediction/neuralnetworkFRmock.py`, `frontend/src/components/AirQualityApp.js`

## Example: Adding a Real Data Source

- Add a new API script to `api_scripts/`.
- Update `main.py` to import and call the new fetch function.
- If integrating with frontend, expose via Flask and fetch in React.

---

**Feedback requested:** Are any workflows, conventions, or integration details unclear or missing? Suggest improvements or ask for deeper documentation on any part of the stack.
