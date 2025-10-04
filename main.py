from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

API_KEY = "2027260e113dc61a1c32f83250cdc4f6d2d3aa79ce7739374b25cfd196025647"  # wklej swój klucz OpenAQ
BASE_URL = "https://api.openaq.org/v3"

headers = {"X-API-Key": API_KEY}

@app.route("/")
def index():
    return jsonify({"message": "Air Quality API backend działa 🚀"})


@app.route("/locations", methods=["GET"])
def get_locations():
    """Zwraca listę dostępnych lokalizacji"""
    resp = requests.get(f"{BASE_URL}/locations?limit=5", headers=headers)
    return jsonify(resp.json())


@app.route("/measurements/<int:location_id>", methods=["GET"])
def get_measurements(location_id):
    """Zwraca pomiary dla konkretnej lokalizacji"""
    resp = requests.get(f"{BASE_URL}/measurements?location_id={location_id}&limit=5", headers=headers)
    return jsonify(resp.json())


@app.route("/city", methods=["GET"])
def get_city_data():
    """Wyszukuje lokalizacje po nazwie miasta i zwraca pomiary"""
    city = request.args.get("name", "Szczecin")
    # szukamy ID lokalizacji
    resp = requests.get(f"{BASE_URL}/locations?city={city}&limit=1", headers=headers)
    data = resp.json()
    if not data["results"]:
        return jsonify({"error": "Nie znaleziono miasta"}), 404

    loc_id = data["results"][0]["id"]
    meas = requests.get(f"{BASE_URL}/measurements?location_id={loc_id}&limit=5", headers=headers)
    return jsonify(meas.json())


if __name__ == "__main__":
    app.run(debug=True)

