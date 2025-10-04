from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
import math
import json
from datetime import datetime, timezone, timedelta

client_id = 'sh-665b9f90-1b62-463e-81dd-f153e09f6d0b'
client_secret = 'aTIJjIS37jKXNIXiYCQ3jVwacQu488Y1'

client = BackendApplicationClient(client_id=client_id)
oauth = OAuth2Session(client=client)

token = oauth.fetch_token(token_url='https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token',
                          client_secret=client_secret, include_client_id=True)
resp = oauth.get("https://sh.dataspace.copernicus.eu/configuration/v1/wms/instances")




def get_no2_stats(oauth, lat, lon, size_km=70):
    """
    Get Sentinel-5P NO2 statistics for a square area around a point.

    Args:
        oauth: Authenticated OAuth session
        lat (float): Latitude of the center point
        lon (float): Longitude of the center point
        size_km (float): Width of the square area in km (default 25 km)

    Returns:
        dict: JSON response with NO2 statistics
    """
    # Approximate conversion: 1 deg latitude ≈ 111 km
    half_size_deg_lat = size_km / 2 / 111.0
    # Longitude degree size depends on latitude
    half_size_deg_lon = size_km / 2 / (111.320 * math.cos(math.radians(lat)))
    
    bbox = [
        lon - half_size_deg_lon,
        lat - half_size_deg_lat,
        lon + half_size_deg_lon,
        lat + half_size_deg_lat
    ]
    
    evalscript = """//VERSION=3
function setup() {
  return {
    input: [{ bands: ["NO2", "dataMask"] }],
    output: [
      { id: "no2", bands: 1, sampleType: "FLOAT32" },
      { id: "dataMask", bands: 1 }
    ]
  }
}
function evaluatePixel(sample) {
  return {
    no2: [sample.NO2],
    dataMask: [sample.dataMask]
  }
}"""
    now = datetime.now(timezone.utc)

    yesterday = now - timedelta(days=1)
    yesterday_midnight = datetime(
        year=yesterday.year,
        month=  yesterday.month,
        day=  yesterday.day,
        hour= 23,
        minute= 59,
        second= 59,
        tzinfo=timezone.utc
    )
    time_from = yesterday_midnight.strtime("%Y-%m-%dT%H-%M-%SZ")
    time_to = now.strtime("%Y-%m-%dT%H-%M-%SZ")
    stats_request = {
        "input": {
            "bounds": {
                "bbox": bbox,
                "properties": {"crs": "http://www.opengis.net/def/crs/EPSG/0/4326"}
            },
            "data": [
                {
                    "type": "sentinel-5p-l2",
                    "dataFilter": {
                        "timeRange": {
                            "from": time_from,
                            "to": time_to
                        }
                    }
                }
            ]
        },
        "aggregation": {
            "timeRange": {
                            "from": time_from,
                            "to": time_to
            },
            "aggregationInterval": {"of": "P1D"},
            "evalscript": evalscript,
            "resx": 0.05,
            "resy": 0.05
        },
        "calculations": {
            "default": {
                "histograms": {"default": {"nBins": 10, "lowEdge": 0.0, "highEdge": 0.0003}},
                "statistics": {"default": {"percentiles": {"k": [25, 50, 75, 90]}}}
            }
        }
    }
    
    url = "https://sh.dataspace.copernicus.eu/api/v1/statistics"
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    
    response = oauth.request("POST", url=url, headers=headers, json=stats_request)
    
    if response.status_code != 200:
        raise Exception(f"Request failed: {response.status_code} {response.text}")
    
    return response.json()



import datetime
import json
import math

def get_so2_stats_km(oauth, center_lat, center_lon, size_km=50, start_date=None, end_date=None):
    """
    Query Sentinel-5P L2 SO2 statistics for a square area around a center point.

    Parameters
    ----------
    oauth : OAuth2Session
        Authenticated OAuth2 session.
    center_lat : float
        Latitude of center point.
    center_lon : float
        Longitude of center point.
    size_km : float
        Field size in km (square side length).
    start_date : str, optional
        ISO 8601 start date (default: 7 days ago).
    end_date : str, optional
        ISO 8601 end date (default: today).

    Returns
    -------
    dict : JSON statistics from the Sentinel Hub Statistics API.
    """
    now = datetime.now(timezone.utc)

    yesterday = now - timedelta(days=1)
    yesterday_midnight = datetime(
        year=yesterday.year,
        month=  yesterday.month,
        day=  yesterday.day,
        hour= 23,
        minute= 59,
        second= 59,
        tzinfo=timezone.utc
    )
    start_date = yesterday_midnight.strtime("%Y-%m-%dT%H-%M-%SZ")
    end_date = now.strtime("%Y-%m-%dT%H-%M-%SZ")
    
    # Convert size from km to degrees
    lat_rad = math.radians(center_lat)
    half_lat_deg = (size_km / 2) / 111
    half_lon_deg = (size_km / 2) / (111 * math.cos(lat_rad))

    bbox = [
        center_lon - half_lon_deg,
        center_lat - half_lat_deg,
        center_lon + half_lon_deg,
        center_lat + half_lat_deg
    ]

    # --- Sentinel Hub evalscript ---
    evalscript = """//VERSION=3
    function setup() {
      return {
        input: [{ bands: ["SO2", "dataMask"] }],
        output: [
          { id: "so2", bands: 1, sampleType: "FLOAT32" },
          { id: "dataMask", bands: 1 }
        ]
      }
    }
    function evaluatePixel(sample) {
      return {
        so2: [sample.SO2],
        dataMask: [sample.dataMask]
      }
    }
    """

    stats_request = {
      "input": {
        "bounds": { "bbox": bbox, "properties": { "crs": "http://www.opengis.net/def/crs/EPSG/0/4326" } },
        "data": [
          {
            "type": "sentinel-5p-l2",
            "dataFilter": { "timeRange": { "from": start_date, "to": end_date } }
          }
        ]
      },
      "aggregation": {
        "timeRange": { "from": start_date, "to": end_date },
        "aggregationInterval": { "of": "P1D" },
        "evalscript": evalscript,
        "resx": 0.05,
        "resy": 0.05
      },
      "calculations": {
        "default": {
          "histograms": { "default": { "nBins": 10, "lowEdge": 0.0, "highEdge": 0.005 } },
          "statistics": { "default": { "percentiles": { "k": [25, 50, 75, 90] } } }
        }
      }
    }

    headers = { "Content-Type": "application/json", "Accept": "application/json" }
    url = "https://sh.dataspace.copernicus.eu/api/v1/statistics"

    response = oauth.request("POST", url=url, headers=headers, json=stats_request)
    data = response.json()

    if response.status_code != 200:
        raise RuntimeError(f"API Error {response.status_code}: {data}")

    return data



# Example usage:
result = get_no2_stats(oauth, 53.75, 13.5, size_km=70)
print(json.dumps(result, indent=2))
result = get_no2_stats(oauth, 61, 11, size_km=70)
print(json.dumps(result, indent=2))
result = get_no2_stats(oauth, 64, 15, size_km=70)
print(json.dumps(result, indent=2))
result = get_no2_stats(oauth, 45, 8, size_km=70)
print(json.dumps(result, indent=2))

