#[starknet::contract]
mod HTLCERC20 {
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use starknet::ContractAddress;
    use starknet::contract_address_const;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        LockFunds: LockFunds,
        ReleaseFunds: ReleaseFunds,
        Refund: Refund,
        APICallTriggered: APICallTriggered,
    }

    #[derive(Drop, starknet::Event)]
    struct LockFunds {
        sender: ContractAddress,
        amount: u256,
        time_lock: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct ReleaseFunds {
        recipient: ContractAddress,
        amount: u256,
        btc_recipient: felt252,
        btc_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Refund {
        sender: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct APICallTriggered {
        btc_recipient: felt252,
        btc_amount: u256,
    }

    #[storage]
    struct Storage {
        sender: ContractAddress,
        recipient: ContractAddress,
        btc_recipient: felt252,
        erc20_token: ContractAddress,
        amount: u256,
        time_lock: u64,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        recipient: ContractAddress,
        btc_recipient: felt252,
        erc20_token: ContractAddress,
        amount: u256,
        time_lock: u64,
    ) {
        self.sender.write(get_caller_address());
        self.recipient.write(recipient);
        self.btc_recipient.write(btc_recipient);
        self.erc20_token.write(erc20_token);
        self.amount.write(amount);
        self.time_lock.write(get_block_timestamp() + time_lock);
    }

    #[external(v0)]
    fn lock_funds(ref self: ContractState) {
        let caller = get_caller_address();
        assert(caller == self.sender.read(), 'Only sender can call this function');

        let token = IERC20Dispatcher { contract_address: self.erc20_token.read() };
        let amount = self.amount.read();
        assert(token.transfer_from(caller, starknet::get_contract_address(), amount), 'Transfer failed');

        self.emit(Event::LockFunds(LockFunds {
            sender: caller,
            amount: amount,
            time_lock: self.time_lock.read(),
        }));

        self.emit(Event::APICallTriggered(APICallTriggered {
            btc_recipient: 0,
            btc_amount: 0,
        }));
    }

    #[external(v0)]
    fn release_funds(ref self: ContractState, btc_amount: u256) {
        let caller = get_caller_address();
        assert(caller == self.recipient.read(), 'Only recipient can call this function');
        assert(get_block_timestamp() >= self.time_lock.read(), 'Timelock not expired');

        let token = IERC20Dispatcher { contract_address: self.erc20_token.read() };
        let amount = self.amount.read();
        assert(token.transfer(self.recipient.read(), amount), 'Transfer failed');

        self.emit(Event::ReleaseFunds(ReleaseFunds {
            recipient: self.recipient.read(),
            amount: amount,
            btc_recipient: self.btc_recipient.read(),
            btc_amount: btc_amount,
        }));

        self.emit(Event::APICallTriggered(APICallTriggered {
            btc_recipient: self.btc_recipient.read(),
            btc_amount: btc_amount,
        }));
    }

    #[external(v0)]
    fn refund(ref self: ContractState) {
        let caller = get_caller_address();
        assert(caller == self.sender.read(), 'Only sender can call this function');
        assert(get_block_timestamp() >= self.time_lock.read(), 'Timelock not expired');

        let token = IERC20Dispatcher { contract_address: self.erc20_token.read() };
        let amount = self.amount.read();
        assert(token.transfer(self.sender.read(), amount), 'Refund failed');

        self.emit(Event::Refund(Refund {
            sender: self.sender.read(),
            amount: amount,
        }));
    }
}