from prediction.neuralnetworkFRmock import pollution_assessment
from flask_swagger_ui import get_swaggerui_blueprint
from flask import Flask, jsonify, request

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

    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)

    if latitude is None or longitude is None:
        return jsonify({
            "error": "Brakujący parametr 'latitude' lub 'longitude'.",
            "example_usage": "/predict?latitude=50.06&longitude=19.94"
        }), 400

    result = pollution_assessment(latitude=latitude, longitude=longitude)

    if "error" in result:
        return jsonify(result), 404

    return jsonify(result)

@app.route("/")
def index():
    return "Serwer predykcji smogu działa! Sprawdź endpoint /predict lub /swagger dla dokumentacji"


if __name__ == "__main__":
    app.run(debug=True, port=5001)