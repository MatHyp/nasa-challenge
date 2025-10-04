from openaq import OpenAQ
import json
import math
import sys


def distance(loc1, loc2):
    return math.sqrt((loc1[0] - loc2[0]) ** 2 + (loc1[1] - loc2[1]) ** 2)


def _pick_dt(dt):
    if not dt:
        return None
    if isinstance(dt, str):
        return dt
    if isinstance(dt, dict):
        return dt.get("local") or dt.get("utc")
    return getattr(dt, "local", None) or getattr(dt, "utc", None)


def _sensorid_to_param_from_location(result):
    m = {}
    for s in getattr(result, "sensors", []) or []:
        p = getattr(s, "parameter", None)
        pname = getattr(p, "name", None) if p else None
        sid = getattr(s, "id", None)
        if sid is not None and pname:
            m[sid] = pname
    return m


def get_latest_for_location(client, location_obj):
    wanted = ["pm25", "pm10", "no2", "so2"]
    values = {k: None for k in wanted}
    czas = None

    sensor_map = _sensorid_to_param_from_location(location_obj)
    resp = client.locations.latest(locations_id=location_obj.id)
    items = getattr(resp, "results", []) or []

    for it in items:
        sid = getattr(it, "sensors_id", None) or getattr(it, "sensor_id", None)
        pname = sensor_map.get(sid)
        val = getattr(it, "value", None)
        dt = _pick_dt(getattr(it, "datetime", None) or getattr(it, "date", None))
        if pname in values and values[pname] is None:
            values[pname] = val
        if dt and (czas is None or dt > czas):
            czas = dt

    return values, czas


def format_location(result, client):
    values, czas_latest = get_latest_for_location(client, result)
    czas = czas_latest or _pick_dt(getattr(result, "datetime_last", None))
    return {
        "place": result.name,
        "time": czas,
        "pm2.5": values.get("pm25"),
        "pm10": values.get("pm10"),
        "no2": values.get("no2"),
        "so2": values.get("so2"),
    }


def get_data(latitude, longitude):
    client = OpenAQ(api_key="cd23b0c0a1c6f6ef001ddd3059bc2f6b7ba8fc1979593bf64b3711483ec9fd25")

    location_response = client.locations.list(
        coordinates=(latitude, longitude), radius=10000, limit=100
    )

    if not location_response.results:
        return json.dumps({"error": "Nie znaleziono stacji w promieniu 10 km."}, ensure_ascii=False, indent=2)

    min_distance = sys.float_info.max
    nearest_station = None
    target_loc = (latitude, longitude)

    for result in location_response.results:
        station_loc = (result.coordinates.latitude, result.coordinates.longitude)
        dist = distance(target_loc, station_loc)
        if dist < min_distance:
            min_distance = dist
            nearest_station = result

    if nearest_station is None:
        return json.dumps(None, ensure_ascii=False, indent=2)

    return json.dumps(format_location(nearest_station, client), ensure_ascii=False, indent=2)


if __name__ == "__main__":
    lat = 53.4387
    lon = 14.5429
    print(get_data(lat, lon))

