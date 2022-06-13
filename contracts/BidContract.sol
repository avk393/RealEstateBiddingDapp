// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


// This contract acts as a bidding mechanism for an account to list a product or service to be bid on until the seller closes it
// The highest bidder's ETH is locked into the contract until a higher bid is placed (in which case thier funds will be returned) or seller closes bidding
// Once seller closes the bidding, the funds are locked into the contract while the deal is looked over. The high bidder has the option to
//      either finalize the transaction and send the funds to the buyer or revert the bid and recover the bid funds

// Future implementation:
//  - Make contract immutable once timer runs out?
//  - Devise mechanism to lock all bids so no bidder knows if their bid is the highest
//  - Cosider architecture: 1 contract for every listing or 1 master contract?
//  - Mechanism to finalize transfer of land title
//  - Create a ERC20 token to bid with
//  - Edge case: bids being placed while bidder closes/aborts listing

contract BidContract {

    // Counter used to identify each listing
    uint256 private listingId;

    struct ListingDetails {
        // account creating the listing
        address owner;
        // IPFS URI in hex with first two bytes (0x1220) chopped off
        // Expect json format with different IPFS URI's of listing pictures
        bytes32 listingURI;
        // current highest bidder
        address maxBidder;
        // current highest bid
        uint256 maxBid;
        // status of listing
        bool stillActive;
        bool aborted;
        // [TODO] Future implementation: token(s) accepted
        // address acceptedTokens[]
    }

    // Mapping that holds all listings
    mapping (uint256 => ListingDetails) private listingTable;

    event BidOpened(uint256 id, address owner, bytes32 listingURI);
    event BidClosed(uint256 id, address owner, bytes32 listingURI, address maxBidder, uint256 maxBid);
    event BidSubmitted(address bidder, bytes32 listingURI);

    /**
     * Contract initialization.
     */
    constructor() {
        listingId = 0;
    }

    /**
     * Returns highest bidder on active listing
     * Can only be called by account that created listing.
     */
    function getActiveMaxBid(uint256 _id) external view returns (uint256) {
        // Get listed item info
        ListingDetails storage listing = listingTable[_id];
        require(listing.owner == msg.sender, "Only the owner of the listing can see the highest bid");
        require(listing.stillActive, "This listing is either expired or completed");

        return listing.maxBid;
    }

    /**
     * Opens the bidding.
     * [TODO] implement optional timer countdown for closing
     */
    function createBid(bytes32 _listingURI) external {
        listingTable[listingId] = ListingDetails(msg.sender, _listingURI, msg.sender, 0, true, false);

        emit BidOpened(listingId, msg.sender, _listingURI);
        listingId++;
    }

    /**
     * Placing a bid on the listed item.
     *   // [TODO] how to check if bidder actually has this bidAmount?
     *   // [TODO] check to make sure owner not bidding?
     *   // [TODO] safe math operators
     */
    function placeBid(uint256 _id) external payable {
        // Get listed item info
        ListingDetails storage listing = listingTable[_id];
        require(listing.stillActive, "This contract is no longer taking bids, sorry!");
        require(msg.value > 0, "The bid must be greater than 0!");

        if(msg.value > listing.maxBid) {
            // Creating temp variables to unlock ETH for previous highest bidder
            address payable expMaxBidder = payable(listing.maxBidder);
            uint256 expMaxBid = listing.maxBid;

            // Setting highet bidder and locking ETH
            listing.maxBidder = msg.sender;
            listing.maxBid = msg.value;
            // Unlocking ETH for previous highest bidder
            expMaxBidder.transfer(expMaxBid);
        }

        // emit BidSubmitted(msg.sender, listing.listingURI);
    }

    /**
     * Finalizes the bidding.
     * [TODO] implement optional timer countdown for closing
     * [TODO] finalize transaction
     *
     * Can only be called by account that created listing.
     */
    function closeBid(uint256 _id) external returns (address) {
        // Get listed item info
        ListingDetails storage listing = listingTable[_id];
        require(listing.stillActive, "Bidding has already expired on this contract");
        require(listing.owner==msg.sender, "You are not the owner. Nice try!");

        // Closing bid
        listing.stillActive = false;
        emit BidClosed(_id, listing.owner, listing.listingURI, listing.maxBidder, listing.maxBid);
        return listing.maxBidder;
    }

    /**
     * Aborts the bidding.
     *
     * Can only be called by account that created listing.
     */
    function abortBid(uint256 _id) external payable {
        // Get listed item info
        ListingDetails storage listing = listingTable[_id];
        require(listing.stillActive, "Bidding has already expired on this contract");
        require(listing.owner==msg.sender, "You are not the owner. Nice try!");

        // Release funds back to highest bidder
        if(listing.maxBid > 0){
            address payable maxBidder = payable(listing.maxBidder);
            maxBidder.transfer(listing.maxBid);
        }

        // Closing bid
        listing.stillActive = false;
        listing.aborted = true;
        listing.maxBidder = msg.sender;
        listing.maxBid = 0;
        emit BidClosed(_id, listing.owner, listing.listingURI, listing.maxBidder, listing.maxBid);
    }

    /**
     * Finalizes the transaction and sends funds to seller or back to buyer if deal falls through.
     * [TODO] implement multiwallet signature, so both seller and buyer must sign off for finalized transfer
     *
     * Can only be called by highest bidder on inactive contract.
     */
    function finalizeTransfer(uint256 _id, bool finalize) external payable {
        // Get listed item info
        ListingDetails storage listing = listingTable[_id];
        require(!listing.stillActive, "Bidding is still active on this contract!");
        require(!listing.aborted, "The owner of this contract has voided the bidding.");
        require(listing.maxBidder==msg.sender, "You are not the highest bidder. Nice try!");

        // Sending locked funds to seller or buyer
        address payable recipient = payable(msg.sender);
        if(finalize) {
            recipient = payable(listing.owner);
        }
        recipient.transfer(listing.maxBid);
    }

}