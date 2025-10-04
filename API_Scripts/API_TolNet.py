import time
import random

def fetch_TolNet():

    print("--- [MOCK] Łączenie z serwerem danych TEMPO... ---")
    time.sleep(1.5)

    mock_dane = [
        {
            "timestamp": "2023-10-27T10:00:00Z",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "no2_column_density": random.uniform(0.5, 5.0) * 1e15,  # Cząsteczki/cm^2
            "product_version": "v2.1"
        },
        {
            "timestamp": "2023-10-27T10:00:00Z",
            "latitude": 34.0522,
            "longitude": -118.2437,
            "no2_column_density": random.uniform(1.0, 8.0) * 1e15,
            "product_version": "v2.1"
        }
    ]

    print("--- [MOCK] Dane TEMPO pobrane pomyślnie. ---")
    return mock_dane