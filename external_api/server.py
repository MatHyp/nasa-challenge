
from prediction.neuralnetworkFRmock import get_smog_prediction
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    mock_weather_input = {"wind_speed_kmh": 15, "humidity_percent": 70}
    mock_air_quality_input = [{"value": 25}]

    smog_prediction = get_smog_prediction(
        weather_data=mock_weather_input,
        air_quality_data=mock_air_quality_input
    )

    return jsonify(smog_prediction)


@app.route("/")
def index():
    return "Serwer predykcji smogu działa! Sprawdź endpoint /predict"


if __name__ == "__main__":
    app.run(debug=True, port=5001)