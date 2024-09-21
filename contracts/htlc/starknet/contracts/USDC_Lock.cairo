%lang starknet

// Define an interface for interacting with ERC20 contracts
@contract_interface
namespace ERC20 {
    func transfer(sender: felt252, recipient: felt252, amount: Uint256) -> (success: felt252) {
    }
}

// Define storage variables using the storage_var attribute
@storage_var
func locked_amount() -> Uint256 {
}

@storage_var
func lock_time() -> felt252 {
}

// Define the event emitted when USDC is locked
@event
func USDC_Locked(sender: felt252, amount: Uint256, lock_time: felt252) {
}

// External function to lock tokens
@external
func lock_tokens{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr: felt*}(
    erc20_address: felt252,
    amount: Uint256
) {
    // Get the current block timestamp
    let (current_time) = get_block_timestamp();

    // Ensure USDC tokens are locked by calling the ERC20 contract transfer function
    let (success) = ERC20.transfer(erc20_address, contract_address, amount);
    assert success == 1;

    // Update locked amount and lock timestamp
    locked_amount::write(amount);
    lock_time::write(current_time);

    // Emit event that tokens were locked
    USDC_Locked.emit(msg_sender, amount, current_time);
}

// External function to withdraw locked tokens
@external
func withdraw_tokens{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr: felt*}() {
    let (current_time) = get_block_timestamp();
    let (lock_timestamp) = lock_time::read();

    // Check if the timelock period has expired (e.g., 1 hour = 3600 seconds)
    assert current_time > (lock_timestamp + 3600);

    // Transfer the locked USDC back to the sender (Alice)
    let (amount) = locked_amount::read();
    let (success) = ERC20.transfer(contract_address, msg_sender, amount);
    assert success == 1;

    // Clear the locked amount after withdrawal
    locked_amount::write(Uint256(0, 0));
}
