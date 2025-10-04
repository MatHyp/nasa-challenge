from prediction.neuralnetworkFRmock import get_smog_prediction
from flask import Flask, jsonify
from flask_swagger_ui import get_swaggerui_blueprint

app = Flask(__name__)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "API Predykcji Smogu"
    }
)

app.register_blueprint(swaggerui_blueprint)


@app.route("/predict", methods=["GET"])
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
    return "Serwer predykcji smogu działa! Sprawdź endpoint /predict lub /swagger dla dokumentacji"


if __name__ == "__main__":
    app.run(debug=True, port=5001)