import * as types from "./actionTypes";

export function signerLoaded(address){
  return { type: types.WALLET_LOADED, address };
}

export function bidContractLoaded(contract){
  return { type: types.CONTRACT_LOADED, contract };
}

export function imageLoaded(image){
  return { type: types.IMAGE_LOADED, image };
}

export function listingsLoaded(listing){
  return { type: types.LISTINGS_LOADED, listing };
}

export function closedListingsLoaded(closedListing){
  return { type: types.CLOSED_LISTINGS_LOADED, closedListing };
}

export function listingIdLoaded(listingId){
  return { type: types.LISTING_ID_LOADED, listingId };
}

export function bidAmountChanged(bidAmount){
  return { type: types.BID_AMOUNT_CHANGED, bidAmount };
}