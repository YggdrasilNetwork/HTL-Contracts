import asyncio
from starknet_py.net.client import Client
from starknet_py.contract import Contract
from call_api import call_api

async def listen_events(contract_address, client, api_key):
    contract = await Contract.from_address(contract_address, client)
    print(f"Listening to events on contract at {contract_address}")

    while True:
        events = await client.get_events(
            contract_address=contract_address,
            event_name="ReleaseFunds",  # Event you want to listen to
            from_block=0  # You can modify this if you're starting from a specific block
        )

        for event in events:
            recipient = event["data"][0]
            amount = event["data"][1]
            btc_recipient = event["data"][2]
            btc_amount = event["data"][3]

            print(f"ReleaseFunds event detected: {recipient}, {amount}, {btc_recipient}, {btc_amount}")

            # Call the API to release the BTC
            call_api(api_key, btc_recipient, btc_amount)

        # Delay before next check
        await asyncio.sleep(10)

if __name__ == "__main__":
    client = Client("testnet")
    contract_address = "your_contract_address_here"
    api_key = "your_api_key_here"

    asyncio.run(listen_events(contract_address, client, api_key))
