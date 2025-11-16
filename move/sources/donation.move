module annapoorna::donation {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;

    struct DonationPool has key {
        total_donations: u64,
        total_redemptions: u64,
        balance: u64,
        admin: address,
        donation_events: EventHandle<DonationEvent>,
        redemption_events: EventHandle<RedemptionEvent>,
    }

    struct DonationEvent has drop, store {
        donor: address,
        amount: u64,
        message: String,
        timestamp: u64,
    }

    struct RedemptionEvent has drop, store {
        beneficiary: address,
        amount: u64,
        purpose: String,
        timestamp: u64,
    }

    struct DonorRecord has key {
        total_donated: u64,
        donation_count: u64,
    }

    const E_NOT_ADMIN: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_NOT_INITIALIZED: u64 = 4;

    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);

        if (!exists<DonationPool>(admin_addr)) {
            move_to(admin, DonationPool {
                total_donations: 0,
                total_redemptions: 0,
                balance: 0,
                admin: admin_addr,
                donation_events: account::new_event_handle<DonationEvent>(admin),
                redemption_events: account::new_event_handle<RedemptionEvent>(admin),
            });
        };
    }

    public entry fun donate(
        donor: &signer,
        pool_address: address,
        amount: u64,
        message: vector<u8>,
    ) acquires DonationPool, DonorRecord {
        assert!(amount > 0, E_INVALID_AMOUNT);
        assert!(exists<DonationPool>(pool_address), E_NOT_INITIALIZED);

        let donor_addr = signer::address_of(donor);

        coin::transfer<AptosCoin>(donor, pool_address, amount);

        let pool = borrow_global_mut<DonationPool>(pool_address);
        pool.total_donations = pool.total_donations + amount;
        pool.balance = pool.balance + amount;

        event::emit_event(&mut pool.donation_events, DonationEvent {
            donor: donor_addr,
            amount,
            message: string::utf8(message),
            timestamp: timestamp::now_seconds(),
        });

        if (!exists<DonorRecord>(donor_addr)) {
            move_to(donor, DonorRecord {
                total_donated: amount,
                donation_count: 1,
            });
        } else {
            let record = borrow_global_mut<DonorRecord>(donor_addr);
            record.total_donated = record.total_donated + amount;
            record.donation_count = record.donation_count + 1;
        };
    }

    public entry fun redeem(
        admin: &signer,
        beneficiary: address,
        amount: u64,
        purpose: vector<u8>,
    ) acquires DonationPool {
        let admin_addr = signer::address_of(admin);
        assert!(exists<DonationPool>(admin_addr), E_NOT_INITIALIZED);

        let pool = borrow_global_mut<DonationPool>(admin_addr);
        assert!(admin_addr == pool.admin, E_NOT_ADMIN);
        assert!(pool.balance >= amount, E_INSUFFICIENT_BALANCE);
        assert!(amount > 0, E_INVALID_AMOUNT);

        coin::transfer<AptosCoin>(admin, beneficiary, amount);

        pool.total_redemptions = pool.total_redemptions + amount;
        pool.balance = pool.balance - amount;

        event::emit_event(&mut pool.redemption_events, RedemptionEvent {
            beneficiary,
            amount,
            purpose: string::utf8(purpose),
            timestamp: timestamp::now_seconds(),
        });
    }

    #[view]
    public fun get_pool_balance(pool_address: address): u64 acquires DonationPool {
        if (!exists<DonationPool>(pool_address)) {
            return 0
        };
        borrow_global<DonationPool>(pool_address).balance
    }

    #[view]
    public fun get_total_donations(pool_address: address): u64 acquires DonationPool {
        if (!exists<DonationPool>(pool_address)) {
            return 0
        };
        borrow_global<DonationPool>(pool_address).total_donations
    }

    #[view]
    public fun get_total_redemptions(pool_address: address): u64 acquires DonationPool {
        if (!exists<DonationPool>(pool_address)) {
            return 0
        };
        borrow_global<DonationPool>(pool_address).total_redemptions
    }

    #[view]
    public fun get_donor_stats(donor_address: address): (u64, u64) acquires DonorRecord {
        if (!exists<DonorRecord>(donor_address)) {
            return (0, 0)
        };
        let record = borrow_global<DonorRecord>(donor_address);
        (record.total_donated, record.donation_count)
    }

    #[view]
    public fun is_admin(pool_address: address, user_address: address): bool acquires DonationPool {
        if (!exists<DonationPool>(pool_address)) {
            return false
        };
        borrow_global<DonationPool>(pool_address).admin == user_address
    }
}
