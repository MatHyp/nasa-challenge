import requests

WMO_WEATHER_CODES = {
    0: "Czyste niebo",
    1: "Głównie bezchmurnie",
    2: "Częściowe zachmurzenie",
    3: "Pochmurno",
    45: "Mgła",
    48: "Mgła osadzająca szadź",
    51: "Lekka mżawka",
    53: "Umiarkowana mżawka",
    55: "Gęsta mżawka",
    56: "Lekka marznąca mżawka",
    57: "Gęsta marznąca mżawka",
    61: "Słabe opady deszczu",
    63: "Umiarkowane opady deszczu",
    65: "Intensywne opady deszczu",
    66: "Słabe opady marznącego deszczu",
    67: "Intensywne opady marznącego deszczu",
    71: "Słabe opady śniegu",
    73: "Umiarkowane opady śniegu",
    75: "Intensywne opady śniegu",
    77: "Ziarna śnieżne",
    80: "Słabe przelotne opady deszczu",
    81: "Umiarkowane przelotne opady deszczu",
    82: "Intensywne przelotne opady deszczu",
    85: "Słabe przelotne opady śniegu",
    86: "Intensywne przelotne opady śniegu",
    95: "Burza z piorunami",
    96: "Burza z gradem (słaba)",
    99: "Burza z gradem (intensywna)",
}


def get_current_weather(lat: float, lon: float) -> dict | None:

    params = "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current={params}"

    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()
        current_data = data['current']

        weather_code = current_data.get('weather_code')
        condition = WMO_WEATHER_CODES.get(weather_code, "Nieznane warunki")

        formatted_data = {
            "temperature": current_data.get('temperature_2m'),
            "humidity": current_data.get('relative_humidity_2m'),
            "wind_speed": current_data.get('wind_speed_10m'),
            "condition": condition,
        }

        return formatted_data

    except requests.exceptions.RequestException as e:
        print(f"Błąd zapytania do API: {e}")
        return None
    except (KeyError, IndexError) as e:
        print(f"Błąd przetwarzania danych - nieoczekiwana struktura odpowiedzi: {e}")
        return None


if __name__ == "__main__":
    warsaw_lat = 53.63506668442288
    warsaw_lon = 15.61684454482645

    weather_data = get_current_weather(warsaw_lat, warsaw_lon)

    if weather_data:
        print("Pomyślnie pobrano dane:")
        print(f"  Temperatura: {weather_data['temperature']} °C")
        print(f"  Wilgotność: {weather_data['humidity']} %")
        print(f"  Prędkość wiatru: {weather_data['wind_speed']} km/h")
        print(f"  Warunki: {weather_data['condition']}")
    else:
        print("Nie udało się pobrać danych pogodowych.")