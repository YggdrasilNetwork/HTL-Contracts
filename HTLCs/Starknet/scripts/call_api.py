import requests

def call_api(api_key, btc_recipient, btc_amount):
    url = "https://btc-release-api.com/release"  # Replace with the actual endpoint
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    data = {
        "recipient": btc_recipient,
        "amount": btc_amount
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()  # Raises an exception for 4xx/5xx responses
        print(f"BTC release triggered successfully: {response.json()}")
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"An error occurred: {err}")

if __name__ == "__main__":
    # Example usage (these would typically be passed in from the event listener)
    api_key = "your_api_key_here"
    btc_recipient = "recipient_btc_address"
    btc_amount = 0.01  # In BTC
    call_api(api_key, btc_recipient, btc_amount)
