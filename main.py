from API_Scripts.API_OpenAQ import fetch_OpenAQ
from API_Scripts.API_Pandora import fetch_Pandora
from API_Scripts.API_TolNet import fetch_TolNet


def main():

    print(">>> START GŁÓWNEGO PROCESU POBIERANIA DANYCH <<<\n")

    ##tutaj ma ładnie printowac dane i tyle potem zajmiemiy sie predykcja najpierw trzeba wybrać odpowiednia dane
    api_OpenAQ = fetch_OpenAQ()
    api_pandora = fetch_Pandora()
    api_tol = fetch_TolNet()
    print(api_OpenAQ)
    print(api_pandora)
    print(api_tol)


if __name__ == "__main__":
    main()