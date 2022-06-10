// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { bs58 } = require("bs58");

function getBytes32FromIpfsHash(ipfsListing) {
  return "0x"+bs58.decode(ipfsListing).slice(2).toString('hex')
}

const ether = (n) => {
    return ethers.BigNumber.from(
        ethers.utils.formatUnits((n*(10e17)).toString(), 'wei')
    )
}

describe("Bid contract", function () {

    let BidContract;
    let bidContract;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let provider;
    const CID = '0xeb33f90c19b3ae41d5a4415453f0b846d98e91956a3291e10aa00d0c4f058a06';

    /*const tx = await eventEmitter.emitBothEvents(42, "foo");

  const receipt = await tx.wait()

  for (const event of receipt.events) {
    console.log(`Event ${event.event} with args ${event.args}`);
  }*/


    beforeEach(async function () {
        // Get the Contract and Signers here.
        BidContract = await ethers.getContractFactory("BidContract");
        bidContract = await BidContract.deploy();
        await bidContract.deployed()

        provider = await ethers.provider;
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });
    
    describe("Create Bidding", function () {
        it("Checking proper creation of to bid", async function () {
            let listingId = 0
            let maxBid = 0

            // check BidOpened event and initial bid is 0
            const event = await bidContract.createBid((CID), {from: owner.address})
            expect((await bidContract.getActiveMaxBid(listingId, {from: owner.address})).toString()).to.equal(maxBid.toString())
        });

        it("Checking proper access to highest bid", async function (){
            let listingId = 0

            await bidContract.createBid((CID), {from: owner.address})
            // check only bid creator has access to max bid
            await expect(bidContract.connect(addr1).getActiveMaxBid(listingId, {from: addr1.address}))
                .to.be.revertedWith("Only the owner of the listing can see the highest bid")
        });
    });

    describe("Placing Bids", function () {
        let listingId = 0
        let maxBid = ether(2)
        let bal0
        let bal1
        let receipt

        beforeEach(async() => {
            bal0 = await provider.getBalance(owner.address)
            bal1 = await provider.getBalance(addr1.address)
            await bidContract.createBid((CID), {from: owner.address})
            let tx = await bidContract.connect(addr1).placeBid(listingId, {from: addr1.address, value: maxBid})
            receipt = await tx.wait()
        });

        it("Make a higher bid", async function () {
            maxBid = ether(3)
            await bidContract.connect(addr2).placeBid(listingId, {from: addr2.address, value: maxBid})
            expect((await bidContract.getActiveMaxBid(listingId, {from: owner.address})).toString()).to.equal(maxBid.toString())
        });

        it("Make a lower bid", async function () {
            await bidContract.placeBid(listingId, {from: owner.address, value: 100})
            expect((await bidContract.getActiveMaxBid(listingId, {from: owner.address})).toString()).to.equal(maxBid.toString())
        });

        it("Make an invalid bid", async function () {
            await expect(bidContract.placeBid(4, {from: owner.address, value: 0}))
                .to.be.revertedWith("This contract is no longer taking bids, sorry!")
            await expect(bidContract.placeBid(listingId, {from: owner.address, value: 0}))
                .to.be.revertedWith("The bid must be greater than 0")
        });

        it("Check funds subtracted after bid", async function () {
            let postbal1 = await provider.getBalance(addr1.address)
            let gasCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice)
            expect(postbal1).to.equal(bal1.sub(maxBid.add(gasCost)))
        });

        it("Check funds returned after higher bid", async function () {
            let postbal1 = await provider.getBalance(addr1.address)
            let gasCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice)

            let newMaxBid = ether(3)
            let tx2 = await bidContract.connect(addr2).placeBid(listingId, {from: addr2.address, value: newMaxBid})
            receipt2 = await tx2.wait()

            expect(postbal1.add(maxBid)).to.equal(bal1.sub(gasCost))
        });
    });

    describe("Aborting Bids", function () {
        let listingId = 0
        let maxBid = ether(2)
        let bal0
        let bal1
        let receipt
        let maxBidder

        beforeEach(async() => {
            bal0 = await provider.getBalance(owner.address)
            bal1 = await provider.getBalance(addr1.address)
            await bidContract.createBid((CID), {from: owner.address})
            let tx = await bidContract.connect(addr1).placeBid(listingId, {from: addr1.address, value: maxBid})
            receipt = await tx.wait()
        });

        it("Check invalid aborts", async function () {
            await expect(bidContract.connect(addr2).abortBid(listingId, {from: addr2.address})).
                to.be.revertedWith("You are not the owner. Nice try!")
            await bidContract.abortBid(listingId)
            await expect(bidContract.abortBid(listingId)).
                to.be.revertedWith("Bidding has already expired on this contract")
        });

        it("Check aborted bids can't be finalized", async function () {
            await bidContract.abortBid(listingId)
            await expect(bidContract.connect(addr1).finalizeTransfer(listingId, true, {from: addr1.address})).
                to.be.revertedWith("The owner of this contract has voided the bidding")
        });

        it("Check funds returned on abort", async function () {
            let postbal1 = await provider.getBalance(addr1.address)
            let gasCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice)

            await bidContract.abortBid(listingId, {from: owner.address})
            expect(postbal1.add(maxBid)).to.equal(bal1.sub(gasCost))
        });
    });

    describe("Closing Bids", function () {
        let listingId = 0
        let maxBid = ether(2)
        let bal0
        let bal1
        let receipt
        let maxBidder

        beforeEach(async() => {
            bal0 = await provider.getBalance(owner.address)
            bal1 = await provider.getBalance(addr1.address)
            await bidContract.createBid((CID), {from: owner.address})
            let tx = await bidContract.connect(addr1).placeBid(listingId, {from: addr1.address, value: maxBid})
            receipt = await tx.wait()
        });

        it("Check invalid closes", async function () {
            await expect(bidContract.connect(addr2).closeBid(listingId, {from: addr2.address})).
                to.be.revertedWith("You are not the owner. Nice try!")
            maxBidder = await bidContract.closeBid(listingId)
            await expect(bidContract.closeBid(listingId)).
                to.be.revertedWith("Bidding has already expired on this contract")
        });

        /*it("Check max bidder on close", async function () {
            maxBidder = await bidContract.closeBid(listingId)
            let rec = await maxBidder.wait()
            let events = rec.events.pop()
            console.log(events.args[1].toString())
            //expect(maxBidder).to.equal(addr1.address)
        });*/
        
    });

    describe("Finalize Bids", function () {
        let listingId = 0
        let maxBid = ether(2)
        let bal0
        let bal1
        let receipt
        let maxBidder

        beforeEach(async() => {
            bal0 = await provider.getBalance(owner.address)
            bal1 = await provider.getBalance(addr1.address)
            await bidContract.createBid((CID), {from: owner.address})
            let tx = await bidContract.connect(addr1).placeBid(listingId, {from: addr1.address, value: maxBid})
            receipt = await tx.wait()
        });

        it("Check invalid finalizings", async function () {
            await expect(bidContract.connect(addr1).finalizeTransfer(listingId, true)).
                to.be.revertedWith("Bidding is still active on this contract!")

            bidContract.closeBid(listingId)
            await expect(bidContract.finalizeTransfer(listingId, true)).
                to.be.revertedWith("You are not the highest bidder. Nice try!")

            await bidContract.createBid((CID), {from: owner.address})
            await bidContract.abortBid(1)
            await expect(bidContract.finalizeTransfer(1, true)).
                to.be.revertedWith("The owner of this contract has voided the bidding.")
        });

        it("Check finalize funds", async function () {
            maxBidder = await bidContract.closeBid(listingId)
            bal0 = await provider.getBalance(owner.address)
            await bidContract.connect(addr1).finalizeTransfer(listingId, true)
            let postBal0 = await provider.getBalance(owner.address)

            expect(postBal0).to.equal(bal0.add(maxBid))
        });

        it("Check non-finalized funds", async function () {
            maxBidder = await bidContract.closeBid(listingId)
            bal1 = await provider.getBalance(addr1.address)
            tx = await bidContract.connect(addr1).finalizeTransfer(listingId, false)
            receipt = await tx.wait()
            let gasCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice)
            let postBal1 = await provider.getBalance(addr1.address)

            expect(postBal1.sub(maxBid)).to.equal(bal1.sub(gasCost))
        });
        
    });

});