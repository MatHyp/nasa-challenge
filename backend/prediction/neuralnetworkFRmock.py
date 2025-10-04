from api_scripts.api_openAQ import get_data


def pollution_assessment(latitude: float, longitude: float) :
    result = get_data(latitude, longitude)
    return result