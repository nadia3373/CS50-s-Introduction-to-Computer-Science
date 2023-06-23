import requests
def send_message(message):
    url = "https://api.telegram.org/bot<token>/sendMessage?chat_id=<chat_id>&parse_mode=Markdown&text=" + message
    requests.get(url)