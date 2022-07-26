const hre = require("hardhat");
const { ethers } = require("hardhat");
const bidContractAddress = '0x877C1Aa29c3C0B6E9C5920863360B845C4c058c2';


async function main() {
  const contract = await hre.ethers.getContractFactory("BidContract");
  const bidcontract = await contract.attach(bidContractAddress);
  const response = await bidcontract.closeBid(2);
  console.log(response);
}
  
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });