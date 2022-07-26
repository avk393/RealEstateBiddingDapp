import * as types from "../actions/actionTypes";

export default function ethersReducer(state = {}, action) {
  switch (action.type) {
    case types.WALLET_LOADED:
      return { address: action.address };
    case types.CONTRACT_LOADED:
      return { ...state, contract: action.contract };
    case types.IMAGE_LOADED:
      return { ...state, image: action.image };
    case types.LISTING_ID_LOADED:
      return { ...state, listingId: action.listingId };
    case types.BID_AMOUNT_CHANGED:
      return {...state, bidAmount: action.bidAmount};
    case types.LISTINGS_LOADED:
      if(state.listings != undefined){
        return { 
          ...state, 
          listings: {
            ...state.listings, 
            listing: [...state.listings.listing, action.listing]
          }
        };
      }
      else {
        return { 
          ...state, 
          listings: {
            listing: [ action.listing ]
          }
        };
      }
    case types.CLOSED_LISTINGS_LOADED:
      if(state.closedListings != undefined){
        return { 
          ...state, 
          closedListings: {
            ...state.closedListings, 
            closedListing: [...state.closedListings.closedListing, action.closedListing]
          }
        };
      }
      else {
        return { 
          ...state, 
          closedListings: {
            closedListing: [ action.closedListing ]
          }
        };
      }
    default:
      return state;
  }
}
