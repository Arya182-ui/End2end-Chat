import requests

API_KEY = "AIzaSyD7OgRSbVLHhp6A1rQjyNQAG95NPrnr4rE"
url = f"https://generativelanguage.googleapis.com/v1/models?key={API_KEY}"

response = requests.get(url)
if response.status_code == 200:
    data = response.json()
    print("Available models:")
    for model in data.get("models", []):
        print(model["name"])
else:
    print("Error:", response.status_code, response.text)