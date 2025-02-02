#[test_only]
module nftcontract::nfttest_tests {
     use sui::test_scenario::{Self, next_tx, ctx};
    use nftcontract::nfttest::{Self, TestNFT};
    use std::string;

    #[test]
    fun test_mint_and_transfer() {
        let addr1 = @0xA;
        let addr2 = @0xB;
        
        // Start with addr1
        let mut scenario = test_scenario::begin(addr1);
        
        // Test mint
        {
            nfttest::mint_to_sender(
                b"First NFT",
                b"This is the first NFT, yayyyy", 
                b"https://test.com",
                ctx(&mut scenario)
            );
        };
        
        // Switch to addr1's context
        next_tx(&mut scenario, addr1);
        {
            let nft = test_scenario::take_from_sender<TestNFT>(&scenario);
            assert!(string::utf8(b"First NFT") == *nfttest::name(&nft), 0);
            assert!(string::utf8(b"This is the first NFT, yayyyy") == *nfttest::description(&nft), 1);
            
            // Test transfer to addr2
            nfttest::transfer(nft, addr2, ctx(&mut scenario));
        };
        
        // Switch to addr2's context
        next_tx(&mut scenario, addr2);
        {
            let mut nft = test_scenario::take_from_sender<TestNFT>(&scenario);
            
            // Test description update
            nfttest::update_description(
                &mut nft,
                b"This is the second NFT, yayyyy",
                ctx(&mut scenario)
            );
            
            assert!(string::utf8(b"This is the second NFT, yayyyy") == *nfttest::description(&nft), 2);
            
            // Test burn
            nfttest::burn(nft, ctx(&mut scenario));
        };
        
        // Verify NFT no longer exists
        next_tx(&mut scenario, addr2);
        {
            assert!(!test_scenario::has_most_recent_for_sender<TestNFT>(&scenario), 3);
        };
        
        test_scenario::end(scenario);
    }
}
