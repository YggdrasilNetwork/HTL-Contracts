%lang starknet

from starkware.cairo.common.math_cmp import assert_le_felt
from starkware.starknet.common.syscalls import get_caller_address, get_block_timestamp

@contract_interface
namespace IERC20 {
    func transfer(recipient: felt, amount: felt) -> (success: felt):
    end

    func transferFrom(sender: felt, recipient: felt, amount: felt) -> (success: felt):
    end
}

# Storage variables for individual lock data
@storage_var
func unlock_time(identifier: felt) -> felt:
end

@storage_var
func amount(identifier: felt) -> felt:
end

@storage_var
func token_address(identifier: felt) -> felt:
end

@storage_var
func sender_address(identifier: felt) -> felt:
end

@storage_var
func receiver_address(identifier: felt) -> felt:
end

# Events for logging
@event
func Locked(identifier: felt, when: felt, amount: felt, token_address: felt, sender_address: felt, receiver_address: felt):
end

@event
func Claimed(identifier: felt, when: felt, amount: felt, token_address: felt, sender_address: felt, receiver_address: felt):
end

@event
func Retaken(identifier: felt, when: felt, amount: felt, token_address: felt, sender_address: felt, receiver_address: felt):
end

# Function to lock funds
@external
func lock(
    identifier: felt, 
    _unlock_time: felt, 
    _amount: felt, 
    _token_address: felt, 
    _receiver_address: felt
) -> (success: felt) {
    # Ensure the lock does not already exist
    let existing_amount = amount(identifier).read();
    assert existing_amount == 0;

    # Ensure a valid amount is being locked
    assert _amount > 0;

    # Set lock data in storage
    unlock_time(identifier).write(_unlock_time);
    amount(identifier).write(_amount);
    token_address(identifier).write(_token_address);
    sender_address(identifier).write(get_caller_address());
    receiver_address(identifier).write(_receiver_address);

   
    let (success) = IERC20.transferFrom(get_caller_address(), address(), _amount).success;
    assert success == 1;

    # Emit the Locked event
    let current_time = get_block_timestamp();
    emit Locked(identifier, current_time, _amount, _token_address, get_caller_address(), _receiver_address);

    return (1);
}

# Function to claim locked funds by the receiver
@external
func claim(identifier: felt) -> (success: felt) {
    # Fetch lock data
    let _unlock_time = unlock_time(identifier).read();
    let _amount = amount(identifier).read();
    let _receiver_address = receiver_address(identifier).read();
    let _token_address = token_address(identifier).read();

    # Ensure there is a valid lock
    assert _amount > 0;

    # Ensure the claim is happening before the unlock time
    let current_time = get_block_timestamp();
    assert_le_felt(current_time, _unlock_time);

    # Ensure that only the receiver can claim the tokens
    let caller = get_caller_address();
    assert caller == _receiver_address;

    # Transfer ERC20 tokens to the receiver
    let (success) = IERC20.transfer(_receiver_address, _amount).success;
    assert success == 1;

    # Clear the lock data
    amount(identifier).write(0);

    # Emit the Claimed event
    emit Claimed(identifier, current_time, _amount, _token_address, sender_address(identifier).read(), _receiver_address);

    return (1);
}

# Function to retake locked funds by the sender after timelock expires
@external
func retake(identifier: felt) -> (success: felt) {
    # Fetch lock data
    let _unlock_time = unlock_time(identifier).read();
    let _amount = amount(identifier).read();
    let _sender_address = sender_address(identifier).read();
    let _token_address = token_address(identifier).read();

    # Ensure there is a valid lock
    assert _amount > 0;

    # Ensure the timelock has expired
    let current_time = get_block_timestamp();
    assert_le_felt(_unlock_time, current_time);

    # Ensure only the sender can retake the funds
    let caller = get_caller_address();
    assert caller == _sender_address;

    # Transfer ERC20 tokens back to the sender
    let (success) = IERC20.transfer(_sender_address, _amount).success;
    assert success == 1;

    # Clear the lock data
    amount(identifier).write(0);

    # Emit the Retaken event
    emit Retaken(identifier, current_time, _amount, _token_address, _sender_address, receiver_address(identifier).read());

    return (1);
}
