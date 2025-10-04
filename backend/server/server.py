from flask_swagger_ui import get_swaggerui_blueprint
from flask import Flask, jsonify, request

from prediction.neuralnetworkFRmock import air_quality, current_weather, aqi

app = Flask(__name__)

SWAGGER_URL = '/'
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
def getPredict():

    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)

    if latitude is None or longitude is None:
        return jsonify({
            "error": "Brakujący parametr 'latitude' lub 'longitude'.",
            "example_usage": "/predict?latitude=50.06&longitude=19.94"
        }), 400

    result = air_quality(latitude=latitude, longitude=longitude)

    if "error" in result:
        return jsonify(result), 404

    return jsonify(result)


@app.route("/current-weather", methods=["GET"])
def getCurrentWeather():

    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)

    if latitude is None or longitude is None:
        return jsonify({
            "error": "Brakujący parametr 'latitude' lub 'longitude'.",
            "example_usage": "/predict?latitude=50.06&longitude=19.94"
        }), 400

    result = current_weather(latitude=latitude, longitude=longitude)

    if "error" in result:
        return jsonify(result), 404

    return jsonify(result)

@app.route("/aqi", methods=["GET"])
def getAqi():

    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)

    if latitude is None or longitude is None:
        return jsonify({
            "error": "Brakujący parametr 'latitude' lub 'longitude'.",
            "example_usage": "/predict?latitude=50.06&longitude=19.94"
        }), 400

    result = aqi(latitude=latitude, longitude=longitude)

    if "error" in result:
        return jsonify(result), 404

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5001)