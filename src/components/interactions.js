const axios = require('axios');
import { ethers } from 'ethers';
import * as ethersActions from "../redux/actions/ethersActions";
import { bidContractAddress, getBytes32FromIpfsHash, getIpfsHashFromBytes32 } from './utilities';
import BidContract from '../../artifacts/contracts/BidContract.sol/BidContract.json';


var signer, bidContract;


export const loadBlockchain = async (dispatch) => {
  // Fetching Etheruem provider through MetaMask
  // [ TODO ] provide support for other providers/wallets
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  dispatch(ethersActions.signerLoaded(await signer.getAddress()));
  // Retreiving contract
  bidContract = new ethers.Contract(bidContractAddress, BidContract.abi, signer);
  dispatch(ethersActions.bidContractLoaded(bidContract.address));

  // Fetching open/closed events from contract
  const openEvents = await bidContract.queryFilter('BidOpened');
  //const closeEvents = await bidContract.queryFilter('BidClosed')  
  for(const event of openEvents) {
    // Validating the listing URL schema
    // console.log(event);
    const listingURI = getIpfsHashFromBytes32(event.args.listingURI);
    const listingItem = await retrieveIpfsObject(listingURI);
    if(listingItem != undefined && validateListingURI(listingItem)){
      const listing = {
        "id": event.args.id.toNumber(),
        "owner": event.args.owner,
        "listingURI": listingURI,
        "address": listingItem.address,
        "price": listingItem.price,
        "year": listingItem.year,
        "sqft": listingItem.sqft,
        "pictures": [...listingItem.pictures]
      };
      dispatch(ethersActions.listingsLoaded(listing));
    }
  }
}

export const loadListings = async ( dispatch ) => {
  
}

function validateListingURI (listingItem){
  if(
    listingItem.address == undefined ||
    listingItem.price == undefined ||
    listingItem.year == undefined ||
    listingItem.sqft == undefined ||
    listingItem.pictures == undefined
  ) return false;
  else return true;
}

function retrieveIpfsObject (listingURI){
  const url = `https://gateway.pinata.cloud/ipfs/${listingURI}`;
  return axios
    .get(url)
    .then(function (response) {
        if(response.status === 200) {
          //console.log(response);
          return response.data;
        }
    })
    .catch(function (error) {
      console.log(error)
    });
}

/*export function web3Loaded() {
  return function(dispatch){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.send("eth_requestAccounts", [])
      .then(() => {
        const signer = provider.getSigner();
        console.log(signer);
        //dispatch(walletLoaded(signer));

        const bidContract = new ethers.Contract(bidContractAddress, BidContract.abi, signer);
        console.log(bidContract);
        //dispatch(bidContractLoaded(bidContract))
      }
    )
  }
}*/
