import math

from api_scripts.api_airQuality import get_air_quality
from api_scripts.api_currentWeather import get_current_weather

AQI_BREAKPOINTS = {
    "pm2.5": [
        (0.0, 12.0, 0, 50),
        (12.1, 35.4, 51, 100),
        (35.5, 55.4, 101, 150),
        (55.5, 150.4, 151, 200),
        (150.5, 250.4, 201, 300),
        (250.5, 500.4, 301, 500),
    ],
    "pm10": [
        (0, 54, 0, 50),
        (55, 154, 51, 100),
        (155, 254, 101, 150),
        (255, 354, 151, 200),
        (355, 424, 201, 300),
        (425, 604, 301, 500),
    ],
    "no2": [
        (0, 53, 0, 50),
        (54, 100, 51, 100),
        (101, 360, 101, 150),
        (361, 649, 151, 200),
        (650, 1249, 201, 300),
        (1250, 2049, 301, 500),
    ],
    "so2": [
        (0, 35, 0, 50),
        (36, 75, 51, 100),
        (76, 185, 101, 150),
        (186, 304, 151, 200),
        (305, 604, 201, 300),
        (605, 1004, 301, 500),
    ],
}

AQI_CATEGORIES = {
    (0, 50): "Dobra",
    (51, 100): "Umiarkowana",
    (101, 150): "Niezdrowa dla grup wrażliwych",
    (151, 200): "Niezdrowa",
    (201, 300): "Bardzo niezdrowa",
    (301, 500): "Niebezpieczna",
}

def air_quality(latitude: float, longitude: float) :
    result = get_air_quality(latitude, longitude)
    return result

def current_weather(latitude: float, longitude: float) :
    result = get_current_weather(latitude, longitude)
    return result


def calculate_sub_index(pollutant_name: str, concentration: float) -> int:
    if pollutant_name not in AQI_BREAKPOINTS:
        return 0

    for c_low, c_high, i_low, i_high in AQI_BREAKPOINTS[pollutant_name]:
        if c_low <= concentration <= c_high:
            index = ((i_high - i_low) / (c_high - c_low)) * (concentration - c_low) + i_low
            return math.ceil(index)
    return 500


def get_aqi_category(index_value: int) -> str:
    for (low, high), category in AQI_CATEGORIES.items():
        if low <= index_value <= high:
            return category
    return "Poza skalą"


def aqi(latitude: float, longitude: float) -> dict:
    air_data = air_quality(latitude, longitude)

    sub_indices = {}

    for pollutant, concentration in air_data.items():
        if pollutant in AQI_BREAKPOINTS:
            sub_index = calculate_sub_index(pollutant, concentration)
            sub_indices[pollutant] = sub_index

    if not sub_indices:
        return {"aqi": 0, "category": "Brak danych", "dominant_pollutant": None}

    dominant_pollutant = max(sub_indices, key=sub_indices.get)
    final_aqi = sub_indices[dominant_pollutant]

    category = get_aqi_category(final_aqi)

    return {
        "aqi": final_aqi,
        "category": category,
        "dominant_pollutant": dominant_pollutant,
    }

if __name__ == "__main__":
    warsaw_lat = 53.63506668442288
    warsaw_lon = 15.61684454482645

    aqi_result = aqi(warsaw_lat, warsaw_lon)

    print(aqi_result)
