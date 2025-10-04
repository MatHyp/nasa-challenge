import requests


def get_air_quality(lat: float, lon: float) -> dict | None:

    params = "pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide"
    url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&hourly={params}"

    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()

        hourly_data = data['hourly']

        formatted_data = {
            "pm2.5": hourly_data['pm2_5'][0],
            "pm10": hourly_data['pm10'][0],
            "no2": hourly_data['nitrogen_dioxide'][0],
            "so2": hourly_data['sulphur_dioxide'][0],
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
    air_data = get_air_quality(warsaw_lat, warsaw_lon)
    print(air_data)