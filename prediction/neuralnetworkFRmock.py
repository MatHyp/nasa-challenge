import random
import time


def get_smog_prediction(weather_data: dict, air_quality_data: list):
    """
    MOCK SIECI NEURONOWEJ:
    Przyjmuje dane pogodowe i o jakości powietrza, a następnie "przewiduje"
    poziom smogu. Logika jest celowo uproszczona i oparta na kilku regułach,
    aby symulować proces decyzyjny.
    """
    print("--- [MOCK MODELU] Uruchamiam analizę danych wejściowych... ---")
    time.sleep(0.5)  # Symulacja czasu potrzebnego na obliczenia

    # ----- PROSTA LOGIKA DECYZYJNA (UDAJĄCA AI) -----

    # Wyciągamy kluczowe parametry z danych wejściowych
    # Używamy .get() dla bezpieczeństwa, gdyby klucza nie było
    wind_speed = weather_data.get("wind_speed_kmh", 0)
    humidity = weather_data.get("humidity_percent", 0)

    # Załóżmy, że pierwsze dane z listy jakości powietrza są najważniejsze
    main_pollutant_value = 0
    if air_quality_data:
        main_pollutant_value = air_quality_data[0].get("value", 0)

    # Reguły "predykcji"
    if wind_speed > 25:
        level = "Niski"
        recommendation = "Dobra jakość powietrza. Wiatr skutecznie rozprasza zanieczyszczenia."
        confidence = random.uniform(0.90, 0.98)
    elif humidity > 85 and wind_speed < 10:
        level = "Wysoki"
        recommendation = "Zła jakość powietrza. Wysoka wilgotność i słaby wiatr sprzyjają utrzymywaniu się smogu."
        confidence = random.uniform(0.80, 0.92)
    elif main_pollutant_value > 50:  # Przykładowy próg dla PM2.5
        level = "Bardzo wysoki"
        recommendation = "Krytyczna jakość powietrza. Unikaj przebywania na zewnątrz."
        confidence = random.uniform(0.91, 0.99)
    else:
        level = "Umiarkowany"
        recommendation = "Jakość powietrza jest akceptowalna, ale warto zachować ostrożność."
        confidence = random.uniform(0.75, 0.85)

    # Budujemy finalny obiekt z wynikiem predykcji
    prediction_result = {
        "predicted_smog_level": level,
        "smog_index_normalized": round(random.uniform(20.0, 150.0), 2),  # Fikcyjny wskaźnik
        "model_confidence": round(confidence, 2),
        "recommendation_text": recommendation,
        "model_version": "mock_v0.1"
    }

    print(f"--- [MOCK MODELU] Predykcja zakończona. Poziom smogu: {level} ---")
    return prediction_result