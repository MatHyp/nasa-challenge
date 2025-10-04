from flask import Flask, request
from flask_restx import Api, Resource, fields
from prediction.neuralnetworkFRmock import air_quality, current_weather, aqi

app = Flask(__name__)

api = Api(
    app,
    version='1.0',
    title='API Predykcji Smogu',
    description='API do przewidywania poziomu smogu i jakości powietrza',
    doc='/'
)

ns = api.namespace('', description='Operacje predykcji smogu')

location_parser = api.parser()
location_parser.add_argument('latitude', type=float, required=True, help='Szerokość geograficzna', location='args')
location_parser.add_argument('longitude', type=float, required=True, help='Długość geograficzna', location='args')

@ns.route('/air-quality')
class CurrentAirQuality(Resource):
    @ns.doc('get_air_quality')
    @ns.expect(location_parser)
    @ns.response(200, 'Pomyślna predykcja')
    @ns.response(400, 'Brakujące parametry')
    @ns.response(404, 'Błąd pobierania danych')
    def get(self):
        """Pobierz poziom smogu"""
        args = location_parser.parse_args()
        latitude = args['latitude']
        longitude = args['longitude']

        if latitude is None or longitude is None:
            api.abort(400, "Brakujący parametr 'latitude' lub 'longitude'.",
                     example_usage="/predict?latitude=50.06&longitude=19.94")

        result = air_quality(latitude=latitude, longitude=longitude)

        if "error" in result:
            api.abort(404, result.get("error"))

        return result


@ns.route('/current-weather')
class CurrentWeather(Resource):
    @ns.doc('get_current_weather')
    @ns.expect(location_parser)
    @ns.response(200, 'Dane pogodowe')
    @ns.response(400, 'Brakujące parametry')
    @ns.response(404, 'Błąd pobierania danych')
    def get(self):
        """Pobierz aktualną pogodę"""
        args = location_parser.parse_args()
        latitude = args['latitude']
        longitude = args['longitude']

        if latitude is None or longitude is None:
            api.abort(400, "Brakujący parametr 'latitude' lub 'longitude'.",
                     example_usage="/current-weather?latitude=50.06&longitude=19.94")

        result = current_weather(latitude=latitude, longitude=longitude)

        if "error" in result:
            api.abort(404, result.get("error"))

        return result


@ns.route('/aqi')
class AQI(Resource):
    @ns.doc('get_aqi')
    @ns.expect(location_parser)
    @ns.response(200, 'Indeks jakości powietrza')
    @ns.response(400, 'Brakujące parametry')
    @ns.response(404, 'Błąd pobierania danych')
    def get(self):
        """Pobierz indeks jakości powietrza (AQI)"""
        args = location_parser.parse_args()
        latitude = args['latitude']
        longitude = args['longitude']

        if latitude is None or longitude is None:
            api.abort(400, "Brakujący parametr 'latitude' lub 'longitude'.",
                     example_usage="/aqi?latitude=50.06&longitude=19.94")

        result = aqi(latitude=latitude, longitude=longitude)

        if "error" in result:
            api.abort(404, result.get("error"))

        return result


if __name__ == "__main__":
    app.run(debug=True, port=5001)