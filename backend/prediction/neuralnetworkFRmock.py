from api_scripts.api_airQuality import get_air_quality
from api_scripts.api_currentWeather import get_current_weather


def air_quality(latitude: float, longitude: float) :
    result = get_air_quality(latitude, longitude)
    return result

def current_weather(latitude: float, longitude: float) :
    result = get_current_weather(latitude, longitude)
    return result