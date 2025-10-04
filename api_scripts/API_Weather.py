import requests
import pandas as pd
_WEATHER_API_KEY = "5fa5e35a7a0aba385afca077d2c35000"

def fetch_Weather(lat, lon): 
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={_WEATHER_API_KEY}&units=metric"
        response = requests.get(url)
        data = response.json()
        return data
    except Exception:
        return None

def fetch_WeatherForecast(lat, lon):
    try:
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={_WEATHER_API_KEY}&units=metric"
        response = requests.get(url)
        data = response.json()
        forecast = data['list']
        frame = pd.json_normalize(forecast)
        return frame
    
    except Exception:
        return None

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)
pd.set_option('display.max_colwidth', None)
pd.set_option('display.width', None)

