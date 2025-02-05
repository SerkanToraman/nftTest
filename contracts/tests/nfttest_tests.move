#[test_only]
module nftcontract::nfttest_tests;

use nftcontract::nfttest::{Self, TestNFT, Treasury, TreasuryCap, test_init};
use std::string;
use sui::{coin::{Self, Coin}, sui::SUI, test_scenario::{Self, next_tx, ctx}};

#[test]
fun test_end_to_end() {
    let addr1 = @0xA;
    let addr2 = @0xB;

    // Start with addr1
    let mut scenario = test_scenario::begin(addr2);

    test_init(ctx(&mut scenario));

    next_tx(&mut scenario, addr1);
    // Test mint
    {
        let mut treasury = test_scenario::take_shared<Treasury<SUI>>(&scenario);
        let mut coin = coin::mint_for_testing<SUI>(
            100_000_000,
            ctx(&mut scenario),
        );

        let nft = nfttest::mint_to_sender(
            &mut treasury,
            &mut coin,
            b"First NFT".to_string(),
            b"This is the first NFT, yayyyy".to_string(),
            b"https://test.com",
            ctx(&mut scenario),
        );

        transfer::public_transfer(nft, addr1);
        test_scenario::return_shared(treasury);
        coin.destroy_zero()
    };

    // Switch to addr1's context
    next_tx(&mut scenario, addr1);
    {
        let nft = test_scenario::take_from_sender<TestNFT>(&scenario);

        assert!(string::utf8(b"First NFT") == *nfttest::name(&nft), 0);
        assert!(
            string::utf8(b"This is the first NFT, yayyyy") == *nfttest::description(&nft),
            1,
        );

        // Test transfer to addr2
        scenario.return_to_sender(nft);
    };

    // Switch to addr1's context
    next_tx(&mut scenario, addr1);
    {
        let mut nft = test_scenario::take_from_sender<TestNFT>(&scenario);

        // Test description update
        nfttest::update_description(
            &mut nft,
            b"This is the second NFT, yayyyy".to_string(),
            ctx(&mut scenario),
        );

        assert!(
            string::utf8(b"This is the second NFT, yayyyy") == *nfttest::description(&nft),
            2,
        );

        // Test burn
        nfttest::burn(nft, ctx(&mut scenario));
    };

    // Verify NFT no longer exists
    next_tx(&mut scenario, addr1);
    {
        assert!(
            !test_scenario::has_most_recent_for_sender<TestNFT>(&scenario),
            3,
        );
    };

    // Verify NFT no longer exists
    next_tx(&mut scenario, addr2);
    {
        let mut treasury = test_scenario::take_shared<Treasury<SUI>>(&scenario);
        let cap = test_scenario::take_from_sender<TreasuryCap>(&scenario);

        nfttest::set_nft_mint_cost(
            &cap,
            &mut treasury,
            1_000_000_000,
        );

        test_scenario::return_shared(treasury);
        scenario.return_to_sender(cap);
    };

    next_tx(&mut scenario, addr1);
    // Test mint
    {
        let mut treasury = test_scenario::take_shared<Treasury<SUI>>(&scenario);
        let mut coin = coin::mint_for_testing<SUI>(
            1_000_000_000,
            ctx(&mut scenario),
        );

        let nft = nfttest::mint_to_sender(
            &mut treasury,
            &mut coin,
            b"First NFT".to_string(),
            b"This is the first NFT, yayyyy".to_string(),
            b"https://test.com",
            ctx(&mut scenario),
        );

        transfer::public_transfer(nft, addr1);
        test_scenario::return_shared(treasury);
        coin.destroy_zero()
    };

    next_tx(&mut scenario, addr2);
    {
        let mut treasury = test_scenario::take_shared<Treasury<SUI>>(&scenario);
        let cap = test_scenario::take_from_sender<TreasuryCap>(&scenario);

        let coin = nfttest::withdraw_all_funds(
            &cap,
            &mut treasury,
            ctx(&mut scenario),
        );

        test_scenario::return_shared(treasury);
        scenario.return_to_sender(cap);
        transfer::public_transfer(coin, addr2);
    };

    next_tx(&mut scenario, addr2);
    {
        let coin = test_scenario::take_from_sender<Coin<SUI>>(&scenario);

        assert!(coin.value() == 1_100_000_000);

        scenario.return_to_sender(coin);
    };

    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = nfttest::EInsufficientFunds)]
fun test_insufficient_funds() {
    let addr1 = @0xA;
    let addr2 = @0xB;

    let mut scenario = test_scenario::begin(addr2);

    test_init(ctx(&mut scenario));

    next_tx(&mut scenario, addr1);
    {
        let mut treasury = test_scenario::take_shared<Treasury<SUI>>(&scenario);
        let mut coin = coin::mint_for_testing<SUI>(
            10_000_000,
            ctx(&mut scenario),
        );

        let nft = nfttest::mint_to_sender(
            &mut treasury,
            &mut coin,
            b"First NFT".to_string(),
            b"This is the first NFT, yayyyy".to_string(),
            b"https://test.com",
            ctx(&mut scenario),
        );

        transfer::public_transfer(nft, addr1);
        test_scenario::return_shared(treasury);
        coin.destroy_zero()
    };

    test_scenario::end(scenario);
}
