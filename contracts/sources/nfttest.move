/*
/// Module: nftcontract
module nftcontract::nftcontract;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module nftcontract::nfttest;

use std::string;
use sui::{event, url::{Self, Url}};

/// An example NFT that can be minted by anybody
public struct TestNFT has key, store {
    id: UID,
    /// Name for the token
    name: string::String,
    /// Description of the token
    description: string::String,
    /// URL for the token
    url: Url,
    // TODO: allow custom attributes
}

// ===== Events =====

public struct NFTMinted has copy, drop {
    // The Object ID of the NFT
    object_id: ID,
    // The creator of the NFT
    creator: address,
    // The name of the NFT
    name: string::String,
}

// ===== Public view functions =====

/// Get the NFT's `name`
public fun name(nft: &TestNFT): &string::String {
    &nft.name
}

/// Get the NFT's `description`
public fun description(nft: &TestNFT): &string::String {
    &nft.description
}

/// Get the NFT's `url`
public fun url(nft: &TestNFT): &Url {
    &nft.url
}

// ===== Entrypoints =====

#[allow(lint(self_transfer))]
/// Create a new devnet_nft
public fun mint_to_sender(
    name: vector<u8>,
    description: vector<u8>,
    url: vector<u8>,
    ctx: &mut TxContext,
) {
    let sender = ctx.sender();
    let nft = TestNFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        url: url::new_unsafe_from_bytes(url),
    };

    event::emit(NFTMinted {
        object_id: object::id(&nft),
        creator: sender,
        name: nft.name,
    });

    transfer::public_transfer(nft, sender);
}

/// Transfer `nft` to `recipient`
public fun transfer(nft: TestNFT, recipient: address, _: &mut TxContext) {
    transfer::public_transfer(nft, recipient)
}

/// Update the `description` of `nft` to `new_description`
public fun update_description(
    nft: &mut TestNFT,
    new_description: vector<u8>,
    _: &mut TxContext,
) {
    nft.description = string::utf8(new_description)
}

/// Permanently delete `nft`
public fun burn(nft: TestNFT, _: &mut TxContext) {
    let TestNFT { id, name: _, description: _, url: _ } = nft;
    id.delete()
}


