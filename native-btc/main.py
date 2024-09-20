import time
import bitcoin
import blockcypher  # type: ignore

from constants import token, a1, pb1, pk1

a2 = "CEtRthbPLrpGqF55kSS92ZkA1WgDrXeyZ6"
pb2 = "029cde12d6bdc479d8d52db8cb02a754659d36c16607ebd44563e42d7b709a5b29"
pk2 = "da56ce4176b95efe224c9f91b5ae0d370c778df9c51be49effee944299a19247"

def generate_address():
    keypair = blockcypher.generate_new_address(coin_symbol='bcy',api_key=token)
    print("Address is", keypair['address'], keypair["public"], keypair["private"])  

def get_faucet_tokens(addr):
    faucet_tx = blockcypher.send_faucet_coins(
    address_to_fund=addr,satoshis=100000,coin_symbol='bcy',api_key=token)
    print("Faucet txid is", faucet_tx['tx_ref'])

def get_address_info(addr):
    address_overview = blockcypher.get_address_overview(addr,coin_symbol='bcy',api_key=token)
    print("Address balance is", address_overview['balance'])

def get_utxos(addr):
    utxos = blockcypher.get_address_full(addr, coin_symbol='bcy', api_key=token)
    print(utxos)  # This will show all unspent transaction outputs (UTXOs)

def transfer_tokens(to_address:str, to_satoshis:int) -> str | None:
    try:
        inputs = [{'address': a1}, ]
        print('inputs: %s' % inputs)
        outputs = [{'address': to_address, 'value': to_satoshis}, ]
        print('outputs: %s' % outputs)
        
        unsigned_tx = blockcypher.create_unsigned_tx(
            inputs=inputs,
            outputs=outputs,
            # may build with no change address, but if so will verify change in next step
            # done for extra security in case of client-side bug in change address generation
            change_address=None,
            coin_symbol="bcy",
            min_confirmations=0,
            verify_tosigntx=False,  # will verify in next step
            include_tosigntx=True,
            api_key=token,
            preference="high"
            )
        print('unsigned_tx: %s' % unsigned_tx)
        
        change_address_to_use = a1
        tx_is_correct, err_msg = blockcypher.verify_unsigned_tx(
            unsigned_tx=unsigned_tx,
            inputs=inputs,
            outputs=outputs,
            sweep_funds=bool(to_satoshis == -1),
            change_address=change_address_to_use,
            coin_symbol="bcy",
            )
        if not tx_is_correct:
            print('Error: %s' % err_msg)
            
        privkey_list, pubkey_list = [], []
        for proposed_input in unsigned_tx['tx']['inputs']:
            privkey_list.append(pk1)
            pubkey_list.append(pb1)
            # paying from a single key should only mean one address per input:
            assert len(proposed_input['addresses']) == 1, proposed_input['addresses']
        
        print('privkey_list: %s' % privkey_list)
        print('pubkey_list: %s' % pubkey_list)
        
        tx_signatures = blockcypher.make_tx_signatures(
            txs_to_sign=unsigned_tx['tosign'],
            privkey_list=privkey_list,
            pubkey_list=pubkey_list,
            )
        
        print('tx_signatures: %s' % tx_signatures)
        
        broadcasted_tx = blockcypher.broadcast_signed_transaction(
            unsigned_tx=unsigned_tx,
            signatures=tx_signatures,
            pubkeys=pubkey_list,
            coin_symbol="bcy",
            api_key=token,
        )
        print('broadcasted_tx: %s' % broadcasted_tx)
        
        if not ("errors" in broadcasted_tx):
            print("Transaction successful")
            print(broadcasted_tx['tx']['hash'])
            
            return broadcasted_tx['tx']['hash']
        else:
            print("Transaction failed")
            print(broadcasted_tx['errors'])
            
            return None
    except Exception as e:
        print("Error: %s" % e)
        return None

    
        
# generate_address()

# get_faucet_tokens(a1)
# get_faucet_tokens(a1)

# time.sleep(5)
print("Address 1")
get_address_info(a1)

# print("Address 2")
# get_address_info(a2)

# get_utxos(a1)
# transfer_tokens(a2, 100)

# print("Address 2")
# get_address_info(a2)