import os
from starknet_py.net.client import Client
from starknet_py.contract import Contract
from starknet_py.net.signer.stark_curve_signer import KeyPair

async def deploy_contract(client, key_pair, contract_path):
    # Read compiled contract (cairo contract needs to be compiled to .json)
    with open(contract_path, "r") as contract_file:
        compiled_contract = contract_file.read()

    # Deploy contract
    deployment = await Contract.deploy(
        client=client,
        compiled_contract=compiled_contract,
        constructor_args=[],
        key_pair=key_pair,
    )

    print(f"Contract deployed at address: {deployment.deployed_contract.address}")
    return deployment.deployed_contract.address

if __name__ == "__main__":
    client = Client("testnet")  # Use "mainnet" for live deployment
    private_key = int(os.getenv("STARKNET_PRIVATE_KEY"))  # Store the private key in an environment variable
    key_pair = KeyPair.from_private_key(private_key)

    contract_path = "path_to_compiled_contract.json"
    address = deploy_contract(client, key_pair, contract_path)
