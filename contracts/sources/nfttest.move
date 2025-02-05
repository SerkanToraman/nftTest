/*
/// Module: nftcontract
module nftcontract::nftcontract;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module nftcontract::nfttest;

use std::string::String;
use sui::{
    balance::{Self, Balance},
    coin::Coin,
    event,
    sui::SUI,
    url::{Self, Url}
};

/// An example NFT that can be minted by anybody
public struct TestNFT has key, store {
    id: UID,
    /// Name for the token
    name: String,
    /// Description of the token
    description: String,
    /// URL for the token
    url: Url,
    // TODO: allow custom attributes
}

public struct Treasury<phantom T> has key, store {
    id: UID,
    balance: Balance<T>,
    nft_mint_cost: u64,
}

public struct TreasuryCap has key {
    id: UID,
}

// ===== Events =====

public struct NFTMinted has copy, drop {
    // The Object ID of the NFT
    object_id: ID,
    // The creator of the NFT
    creator: address,
    // The name of the NFT
    name: String,
}

// === ERRORS ===

const EInsufficientFunds: u64 = 0;

// === Entrypoints ===

fun init(ctx: &mut TxContext) {
    let treasury = Treasury<SUI> {
        id: object::new(ctx),
        balance: balance::zero(),
        nft_mint_cost: 100_000_000,
    };

    let treasury_cap = TreasuryCap {
        id: object::new(ctx),
    };

    transfer::transfer(treasury_cap, ctx.sender());
    transfer::public_share_object(treasury);
}

// ===== Public Mutative Functions =====

public fun mint_to_sender<T>(
    treasury: &mut Treasury<T>,
    coin: &mut Coin<T>,
    name: String,
    description: String,
    url: vector<u8>,
    ctx: &mut TxContext,
): TestNFT {
    assert!(coin.value() >= treasury.nft_mint_cost, EInsufficientFunds);

    treasury
        .balance
        .join(coin.split(treasury.nft_mint_cost, ctx).into_balance());

    let nft = TestNFT {
        id: object::new(ctx),
        name,
        description,
        url: url::new_unsafe_from_bytes(url),
    };

    event::emit(NFTMinted {
        object_id: object::id(&nft),
        creator: ctx.sender(),
        name: nft.name,
    });

    nft
}

/// Update the `description` of `nft` to `new_description`
public fun update_description(
    nft: &mut TestNFT,
    new_description: String,
    _: &mut TxContext,
) {
    nft.description = new_description
}

/// Permanently delete `nft`
public fun burn(nft: TestNFT, _: &mut TxContext) {
    let TestNFT { id, name: _, description: _, url: _ } = nft;
    id.delete()
}

// === Admin Mutative Functions ===

public fun set_nft_mint_cost<T>(
    _: &TreasuryCap,
    treasury: &mut Treasury<T>,
    new_cost: u64,
) {
    treasury.nft_mint_cost = new_cost;
}

public fun withdraw_all_funds<T>(
    _: &TreasuryCap,
    treasury: &mut Treasury<T>,
    ctx: &mut TxContext,
): Coin<T> {
    let value = treasury.balance.value();
    treasury.balance.split(value).into_coin(ctx)
}

// ===== Public view functions =====

/// Get the NFT's `name`
public fun name(nft: &TestNFT): &String {
    &nft.name
}

/// Get the NFT's `description`
public fun description(nft: &TestNFT): &String {
    &nft.description
}

/// Get the NFT's `url`
public fun url(nft: &TestNFT): &Url {
    &nft.url
}

// === TEST FN

#[test_only]
public fun test_init(ctx: &mut TxContext) {
    init(ctx)
}
